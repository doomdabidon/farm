const express = require('express')
const { faker } = require('@faker-js/faker')
const bodyParser = require('body-parser')
const { fileUploadMiddleware } = require('./fileUploadMiddleware')
const app = express()
const port = 3000
app.use(express.static(`${__dirname}/public`))

//task 1
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

//task 2
app.post('/data', bodyParser.json(), (req, res) => {
    res.json({
        payloadBody: req.body,
        queryParamA: req.query.a,
        queryParamB: req.query.b,
        fakeField: faker.string.alpha(10)
    })
})

//task 3 
app.use(express.static(`${__dirname}/public`))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//task 4
app.get('/upload', (req, res) => {
    res.sendFile(`${__dirname}/uploadForm.html`)
})

const rawParser = bodyParser.raw(
    {
        type: "multipart/form-data",
        limit: "1GB"
    }
)

app.post('/upload', rawParser, fileUploadMiddleware, (req, res) => {
    res.end(`<a href="http://localhost:${port}/${req.file}">${req.file}</a>`)
})
