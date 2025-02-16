const { readFile } = require("fs")

process.on("message", data => {
    readFile(data.filePath, (_, fileContent) => {
        process.send(fileContent.toString())
        process.exit()
    })
})