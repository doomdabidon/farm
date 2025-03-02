const express = require('express')
const { gamesRouter } = require('./gamesRoute')
const app = express()
const port = 3000

app.use("/games", gamesRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
