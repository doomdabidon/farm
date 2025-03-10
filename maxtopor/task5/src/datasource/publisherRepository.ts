import { Publisher } from "../model/publisher";
import { GamesDataSource } from "./datasource";

const repository = GamesDataSource.getRepository(Publisher)

async function getPublishers(gameId: bigint): Promise<Publisher[]> {
    return await repository.query(`
        select publishers.name from publishers
        join games_publishers as gp on publishers.id = gp.publisher_id
        join games as g on g.id = gp.game_id
        where g."id" = '${gameId}'
    `)
}

export default {
    getPublishers
}