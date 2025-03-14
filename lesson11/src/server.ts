import http from 'http';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import express, { Request, Response } from 'express';
import { DataSource, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from 'redis';
import statusMonitor from 'express-status-monitor';

dotenv.config();

const app = express();
app.use(bodyParser.json());      
app.use(statusMonitor());
const server = http.createServer(app);

const redisClient = createClient({
    socket: {
        host: 'redis',
        port: 6379
    }
});

// Handle connection errors
redisClient.on("error", (err) => console.error("Redis connection error:", err));

// Connect to Redis (async)
(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis connection failed:", error);
    }
})();

redisClient.on("error", (err) => console.error("Redis error:", err));

// 🚀 In-Memory Cache
const inMemoryCache = new Map();

const io = new Server(server, {
    path: "/custom/socket",
    cors: {
        origin: "*", // Allow all origins (Modify this for production security)
        methods: ["GET", "POST"]
    }
});

interface AuthenticatedSocket extends Socket {
    user?: any; // Add the `user` property dynamically
}

// WebSocket authentication middleware
io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    try {
        const decoded = jwt.verify(token, 'qwertyuiopasdfghjklzxcvbnm123456');
        socket.user = decoded; // Attach user info to socket object
        next();
    } catch (error) {
        return next(new Error("Authentication error: Invalid token"));
    }
});

// Handle WebSocket connections
io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`New client connected: ${socket.id}, User: ${JSON.stringify(socket.user)}`);

    socket.on("message", (data) => {
        console.log("Received message:", data);
        io.emit("message", { user: socket.user, message: data });
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

@Entity()
class Farm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  location!: string;
}

// Define the Farmer entity
@Entity()
class Farmer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  age!: number;
}

// Define the Animal entity
@Entity()
export class Animal {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    species!: string;

    @Column()
    name!: string;
}

// Define the FarmFarmer relation table
@Entity("farm_farmer")
class FarmFarmer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Farm)
  @JoinColumn({ name: "farmId" })
  farm!: Farm;

  @ManyToOne(() => Farmer)
  @JoinColumn({ name: "farmerId" })
  farmer!: Farmer;
}

// Define the AnimalFarmer relation table
@Entity("animal_farmer")
class AnimalFarmer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Animal)
  @JoinColumn({ name: "animalId" })
  animal!: Animal;

  @ManyToOne(() => Farmer)
  @JoinColumn({ name: "farmerId" })
  farmer!: Farmer;
}

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRESDB_HOST,
    port: Number.parseInt(process.env.POSTGRESDB_LOCAL_PORT || '5432', 10),
    username: process.env.POSTGRESDB_USER,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    database: process.env.POSTGRESDB_DATABASE,
    entities: [Farm, Farmer, Animal, FarmFarmer, AnimalFarmer],
    synchronize: false,
});

AppDataSource.initialize()
    .then(async () => {
        console.log("Database connected");
        await AppDataSource.query(`
            CREATE TABLE IF NOT EXISTS farm (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                location VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS farmer (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                age INT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS animal (
                id SERIAL PRIMARY KEY,
                species VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS farm_farmer (
                farmId INT REFERENCES farm(id) ON DELETE CASCADE,
                farmerId INT REFERENCES farmer(id) ON DELETE CASCADE,
                PRIMARY KEY (farmId, farmerId)
            );
            CREATE TABLE IF NOT EXISTS animal_farmer (
                animalId INT REFERENCES animal(id) ON DELETE CASCADE,
                farmerId INT REFERENCES farmer(id) ON DELETE CASCADE,
                PRIMARY KEY (animalId, farmerId)
            );
        `);
        console.log("Tables ensured with constraints");
    })
    .catch((error) => console.log(error));

const farmRepository = () => AppDataSource.getRepository("Farm");


app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'index.html'));
})

app.post("/transaction", async (req, res) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const { farmName, farmLocation, farmerName, farmerAge, animalName, animalSpecies } = req.body;
        
        const farm = await queryRunner.manager.save(Farm, { name: farmName, location: farmLocation });
        const farmer = await queryRunner.manager.save(Farmer, { name: farmerName, age: farmerAge });
        const animal = await queryRunner.manager.save(Animal, { species: animalSpecies, name: animalName });
        
        await queryRunner.manager.query(
            `INSERT INTO farm_farmer (farmId, farmerId) VALUES ($1, $2)`,
            [farm.id, farmer.id]
        );
        await queryRunner.manager.query(
            `INSERT INTO animal_farmer (animalId, farmerId) VALUES ($1, $2)`,
            [animal.id, farmer.id]
        );
        
        await queryRunner.commitTransaction();
        res.json({ message: "Transaction successful" });
    } catch (error) {
        await queryRunner.rollbackTransaction();
        res.status(500).json({ message: "Transaction failed", error });
    } finally {
        await queryRunner.release();
    }
});


app.post("/farms", async (req, res) => {
    const { name, location } = req.body;
    const farm = farmRepository().create({ name, location });
    await farmRepository().save(farm);
    res.status(201).json(farm);
});

app.get("/farms", async (_, res) => {

    if (inMemoryCache.has("all_farms")) {
        console.log("Serving from In-Memory Cache");
        res.json(inMemoryCache.get("all_farms"));
        return;
    }

    const farms = await farmRepository().find();
    inMemoryCache.set("all_farms", farms);
    res.json(farms);
});

app.get("/farms/:id", async (req, res) => {
    const farmId = req.params.id;
    const cachedFarm = await redisClient.get(`farm:${farmId}`);
    if (cachedFarm) {
        console.log("Serving from Redis Cache");
        res.json(JSON.parse(cachedFarm));
        return;
    }
    const farm = await farmRepository().findOneBy({ id: parseInt(farmId) });

    await redisClient.setEx(`farm:${farmId}`, 3600, JSON.stringify(farm));
    if (farm) res.json(farm);
    else res.status(404).json({ message: "Farm not found" });
});

app.put("/farms/:id", async (req: Request, res: Response): Promise<any> => {
    const farm = await farmRepository().findOneBy({ id: parseInt(req.params.id) });
    if (!farm) return res.status(404).json({ message: "Farm not found" });

    const { name, location } = req.body;
    farm.name = name;
    farm.location = location;
    await farmRepository().save(farm);
    res.json(farm);
});

app.delete("/farms/:id", async (req: Request, res: Response): Promise<any> => {
    const result = await farmRepository().delete(req.params.id);
    if (result.affected === 0) {
        return res.status(404).json({ message: "Farm not found" });
    }
    res.status(204).send();
});

server.listen(8080, function () {
   console.log(`Express App running at http://127.0.0.1:${process.env.NODE_DOCKER_PORT}/`);
});