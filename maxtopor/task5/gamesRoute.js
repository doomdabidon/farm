const express = require('express')
const gamesRepository = require('./storage/dbApi')
const gamesRouter = express.Router()
const bodyParser = require('body-parser')
const { payloadValidator, errorHandler } = require('./middleware')

gamesRouter.get("/", async (req, res) => {
    const games = await gamesRepository.readGames()
    res.json(games)
})

gamesRouter.get("/:id", async (req, res, next) => {
    const game = await gamesRepository.readGameById(req.params.id)
    res.json(game)
})

gamesRouter.get("/:id/publishers", async (req, res, next) => {
    const game = await gamesRepository.readGameById(req.params.id)
    res.json(game.publishers)
})

gamesRouter.post("/", [bodyParser.json(), payloadValidator], async (req, res, next) => {
    await gamesRepository.saveGame(req.body)
    res.end("posted")
})

gamesRouter.put("/:id", bodyParser.json(), async (req, res, next) => {
    const game = req.body

    await gamesRepository.updateGame(game)
    res.end("updated")
})

gamesRouter.delete("/:id", async (req, res) => {
    await gamesRepository.deleteGameById(req.params.id)
    res.end("deleted")
})

gamesRouter.use(errorHandler)

module.exports = {
    gamesRouter
}
