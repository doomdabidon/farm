import { DataSource } from "typeorm";
import { Game } from "../model/game";
import { Genre } from "../model/genre";
import { Role } from "../security/role";
import { User } from "../security/user";
import { Publisher } from "../model/publisher";

export const GamesDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOSTNAME,
    port: 5432,
    username: "maxtopor",
    password: "1234",
    database: "games_db",
    synchronize: false,
    logging: true,
    entities: [Game, Genre, Publisher, User, Role],
    subscribers: [],
    migrations: [],
})