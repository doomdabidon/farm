import express from 'express';
import gamesRepository from '../datasource/gamesRepository';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import { payloadValidator, errorHandler, authenticationHandler, authorizationHandler } from './middleware';

const gamesRouter = express.Router()

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 5, 
    keyGenerator: (req: any, res: any) => req.user.username
})

gamesRouter.use(authenticationHandler, limiter)

gamesRouter.get("/", async (req, res) => {
    const games = await gamesRepository.readGames()
    res.json(games)
})

gamesRouter.get("/:id", async (req, res, next) => {
    const game = await gamesRepository.readGameById(BigInt(req.params.id))
    res.json(game)
})

gamesRouter.get("/:id/publishers", async (req, res, next) => {
    const publishers = await gamesRepository.getPublishers(BigInt(req.params.id))
    res.json(publishers)
})

gamesRouter.post("/", bodyParser.json(), payloadValidator, authorizationHandler("ADMIN"), async (req, res, next) => {
    await gamesRepository.saveGame(req.body)
    res.end("posted")
})

gamesRouter.put("/:id", bodyParser.json(), async (req, res, next) => {
    const game = req.body

    await gamesRepository.updateGame(game)
    res.end("updated")
})

gamesRouter.delete("/:id", async (req, res) => {
    await gamesRepository.deleteGameById(BigInt(req.params.id))
    res.end("deleted")
})

gamesRouter.use(errorHandler)

export {
    gamesRouter
}
