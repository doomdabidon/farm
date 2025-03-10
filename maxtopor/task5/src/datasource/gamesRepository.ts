import { Game } from "../model/game"
import { Genre } from "../model/genre"
import { Publisher } from "../model/publisher"
import { GamesDataSource } from "./datasource"

const repository = GamesDataSource.getRepository(Game)
const genreRepository = GamesDataSource.getRepository(Genre)
const publisherRepository = GamesDataSource.getRepository(Publisher)

async function readGames(): Promise<Game[]> {
    return await repository.find({
        relations: {
            genres: true,
            publishers: true
        }
    })
}

async function readGameById(id: bigint): Promise<Game> {
    const game = await repository.findOne({
        where: {
            id: id
        },
        relations: {
            genres: true,
            publishers: true
        }
    })

    if (!game) {
        throw new Error(`A game with id [${id}] was not found`)
    }

    return game
}

async function deleteGameById(id: bigint) {
    return await repository.delete(Number(id))
}

async function saveGame(game: Game): Promise<Game> {
    const entity = repository.create(game)

    return await repository.save(entity)
}

async function updateGame(game: Game): Promise<Game> {
    const entity = repository.create(game)

    return await repository.save(entity)
}

async function getPublishers(gameId: bigint): Promise<Publisher[]> {
    return await repository.query(`
        select publishers.name from publishers
        join games_publishers as gp on publishers.id = gp.publisher_id
        join games as g on g.id = gp.game_id
        where g."id" = '${gameId}'
    `)
}

export default {
    readGames,
    readGameById,
    deleteGameById,
    saveGame,
    updateGame,
    getPublishers
}