import { DataSource } from "typeorm";
import { Author } from "./entity/author";
import { Book } from "./entity/book";
import { User } from "./entity/user";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgresdb",
    port: 5432,
    username: "root",
    password: "123456",
    database: "alex_db",
    synchronize: false,
    logging: true,
    entities: [Author, Book, User],
    subscribers: [],
    migrations: [],
})