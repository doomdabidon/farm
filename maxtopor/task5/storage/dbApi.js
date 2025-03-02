const fileName = `${__dirname}/db`
const fs = require('fs')
let cache = new Map()

buildCache().then(() => console.log("cache initialized"))

async function readGames() {
    if (cache.size !== 0) {
        return [...cache.values()]
    }

    const content = await fs.promises.readFile(fileName, 'utf-8')

    if (content.length === 0) {
        return []
    }

    return content
        .split("\r\n")
        .filter(row => row.length !== 0)
        .map(row => JSON.parse(row))
}

async function readGameById(id) {
    const intId = parseInt(id)

    if (cache.has(intId)) {
        return cache.get(intId)
    }

    const game = (await readGames()).find(game => game.id === parseInt(intId))

    if (game === undefined) {
        throw Error(`A game with id [${intId}] does not exist`)
    }

    return game
}

async function deleteGameById(id, recache = true) {
    const intId = parseInt(id)
    const games = await readGames()
    const newGames = games.filter(game => game.id !== intId).map(game => JSON.stringify(game)).join("\r\n")

    if (games.size === newGames.size) {
        throw Error(`A game with id [${intId}] does not exist`)
    }

    await fs.promises.writeFile(fileName, newGames, "utf-8")

    if (recache) {
        cache = await buildCache()
    } else {
        incrementalId++;
    }
}

async function saveGame(game, recache = true) {
    game.id = incrementalId
    await fs.promises.appendFile(fileName, `\r\n${JSON.stringify(game)}`)

    if (recache) {
        cache = await buildCache()
    } else {
        incrementalId++;
    }
}

async function updateGame(game, recache = true) {
    if (!game.id) {
        throw Error("Game id must be provided")
    }

    try {
        //game exists
        const currentGame = await readGameById(game.id)

        await deleteGameById(game.id, false)
        await saveGame(game, recache)
    } catch (error) {
        //game does not exist
        game.id = incrementalId
        
        await saveGame(game, recache)
    }
}

let incrementalId = 1;

async function buildCache() {
    const games = await readGames()
    const gamesMap = new Map()
    games.forEach(row => gamesMap.set(row.id, row))

    let id = games.at(games.length - 1)?.id

    if (id) {
        incrementalId = id + 1;
    }
    console.log("id", incrementalId)
    return gamesMap
}

module.exports = {
    readGames,
    readGameById,
    deleteGameById,
    saveGame,
    updateGame
}