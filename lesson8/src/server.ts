import express, { Request, Response } from 'express';
import { DataSource, Entity, PrimaryGeneratedColumn, Column, Repository } from 'typeorm';
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

  @Column()
  name!: string;

  @Column()
  location!: string;
}

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRESDB_HOST,
    port: Number.parseInt(process.env.POSTGRESDB_LOCAL_PORT || '5432', 10),
    username: process.env.POSTGRESDB_USER,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    database: process.env.POSTGRESDB_DATABASE,
    entities: [Farm],
    synchronize: false,
});

AppDataSource.initialize()
    .then(async () => {
        console.log("Database connected");
        
        await AppDataSource.query(`
            CREATE TABLE IF NOT EXISTS farm (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL
            );
        `);
        console.log("Farm table ensured");
    })
    .catch((error: any) => console.log(error));

const farmRepository = () => AppDataSource.getRepository("Farm");

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