import "reflect-metadata"
import "dotenv/config"
import express from 'express'
import { gamesRouter } from './gamesRoute'
import { usersRouter } from './usersRoute'
import { GamesDataSource } from "../datasource/datasource"

GamesDataSource.initialize().then(() => {
    console.log("db initialized")
})
const app = express()
const port = 3000

app.use("/games", gamesRouter)
app.use("/users", usersRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
