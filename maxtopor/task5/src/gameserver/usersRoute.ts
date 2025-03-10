import express from 'express'
import bodyParser from 'body-parser'
import authService from '../security/authorizationService'
import { generateJwt } from './jwtUtils'
import { errorHandler } from './middleware'

const usersRouter = express.Router()

usersRouter.use(bodyParser.json())

usersRouter.get("/authenticate", async (req, res, next) => {
    const { username, password } = req.body
    const authorization = await authService.authorize(username, password)
    const jwt = generateJwt(authorization.username, authorization.roles)

    res.json({ token: jwt })
})

usersRouter.post("/register", async (req, res, next) => {
    const { username, password } = req.body
    const authorization = await authService.register(username, password)
    const jwt = generateJwt(authorization.username, authorization.roles)

    res.json({ token: jwt })
})

usersRouter.use(errorHandler)

export {
    usersRouter
}