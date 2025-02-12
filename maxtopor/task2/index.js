const { faker } = require('@faker-js/faker');
const fs = require('fs');

const args = process.argv.slice(2)
const seedLength = 10

const inputFlagIndex = args.indexOf("-i")

if (inputFlagIndex != -1) {
    const fileName = args[inputFlagIndex + 1]
    const readStream = fs.createReadStream(`task2/files/${fileName}`, { highWaterMark: seedLength - 2 })

    readStream
        .on("open", () => console.log(`${fileName} data:`))
        .on("data", chunk => console.log(`${chunk.toString()}`))
        .on("error", error => console.log(error))
}

const outputFlagIndex = args.indexOf("-o")

if (outputFlagIndex != -1) {
    const fileName = args[outputFlagIndex + 1] + ".txt"
    const writeStream = fs.createWriteStream(`task2/files/${fileName}`)

    writeStream.on("error", error => console.log(error))

    for (let i = 0; i < seedLength; i++) {
        writeStream.write(faker.string.alphanumeric(seedLength) + "\n")
    }

    writeStream.end()
}
