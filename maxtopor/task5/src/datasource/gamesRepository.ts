import { Game } from "../model/game"
import { GamesDataSource } from "./datasource"

const repository = GamesDataSource.getRepository(Game)

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
    entity

    return await repository.save(entity)
}

async function updateGame(game: Game): Promise<Game> {
    const entity = repository.create(game)

    return await repository.save(entity)
}

export default {
    readGames,
    readGameById,
    deleteGameById,
    saveGame,
    updateGame
}