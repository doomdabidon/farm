const express = require('express')
const { gamesRouter } = require('./gamesRoute')
const { usersRouter } = require('./usersRoute')
const app = express()
const port = 3000

app.use("/games", gamesRouter)
app.use("/users", usersRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
