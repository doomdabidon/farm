const express = require('express')
const usersRouter = express.Router()
const bodyParser = require('body-parser')
const authService = require('./authorizationService')
const jwtUtils = require('./jwtUtils')
const { errorHandler } = require('./middleware')

usersRouter.use(bodyParser.json())

usersRouter.get("/authenticate", async (req, res, next) => {
    const { username, password } = req.body
    const authorization = await authService.authorize(username, password)
    const jwt = jwtUtils.generateJwt(authorization.username, authorization.roles)

    res.json({ token: jwt })
})

usersRouter.use(errorHandler)

module.exports = {
    usersRouter
}