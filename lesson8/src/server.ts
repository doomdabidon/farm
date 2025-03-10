import express, { Request, Response } from 'express';
import { DataSource, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();


dotenv.config();
const app = express();
app.use(bodyParser.json());      

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
    const farms = await farmRepository().find();
    res.json(farms);
});

app.get("/farms/:id", async (req, res) => {
    const farm = await farmRepository().findOneBy({ id: parseInt(req.params.id) });
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

app.listen(8080, function () {
   console.log(`Express App running at http://127.0.0.1:${process.env.NODE_DOCKER_PORT}/`);
});