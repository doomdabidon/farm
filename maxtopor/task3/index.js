const { Worker } = require('worker_threads')
const { faker } = require('@faker-js/faker');
const { fork } = require('child_process');
const cpuCount = require('os').cpus().length

//Task 1
function createSubstringCountWorker(sourceString, substring) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(`${__dirname}/substringThread.js`,
            { workerData: { source: sourceString, substring: substring } })

        worker.on("message", resolve)
        worker.on("error", reject)
    })
}

const sourceString = faker.string.alpha(1_000_000)

const substring = "ab"
const chunkSize = Math.ceil(sourceString.length / cpuCount)
let promises = []

for (let i = 0; i < cpuCount; i++) {
    const chunk = sourceString.substring(chunkSize * i, chunkSize + chunkSize * i)
    promises.push(createSubstringCountWorker(chunk, substring))
}

console.time("timeElapsed")

Promise.all(promises).then(data => {
    console.log(`Occurences found:  ${data.reduce((accumulator, currentValue) => accumulator + currentValue)}`)
    console.timeEnd("timeElapsed")
})

//Task 2
const fileReaderFork = fork(`${__dirname}/fileReaderFork.js`)
const filePath = "fileToRead.txt";

fileReaderFork.on("message", data => console.log(`${filePath} content: ${data}`))
fileReaderFork.send({filePath: `${__dirname}/${filePath}`})
