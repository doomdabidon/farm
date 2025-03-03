const express = require('express')
const gamesRepository = require('./storage/dbApi')
const gamesRouter = express.Router()
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit');
const { payloadValidator, errorHandler, authenticationHandler, authorizationHandler } = require('./middleware')

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 5, 
    keyGenerator: (req, res) => req.user.username
})


gamesRouter.use(authenticationHandler, limiter)

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

gamesRouter.post("/", [bodyParser.json(), payloadValidator, authorizationHandler("ADMIN")], async (req, res, next) => {
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
