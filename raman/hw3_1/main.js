const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');
const { faker } = require('@faker-js/faker');

const numThreads = os.cpus().length;
const searchSubstring = "pidr";
const textLength = 100000;

const generateLowerCaseString = (length) => {
    return Array.from({ length }, () => faker.string.alpha(1).toLowerCase()).join('');
};

const largeText = generateLowerCaseString(textLength);

const chunkSize = Math.ceil(textLength / numThreads);
const workers = [];
let totalOccurrences = 0;
let completedWorkers = 0;

console.warn('numThreads: ', numThreads);

for (let i = 0; i < numThreads; i++) {
    const chunk = largeText.slice(i * chunkSize, (i + 1) * chunkSize);
    
    const worker = new Worker(`${__dirname}/worker.js`, {
        workerData: { chunk, searchSubstring }
    });

    worker.on('message', (count) => {
        totalOccurrences += count;
        completedWorkers++;

        if (completedWorkers === numThreads) {
            console.log(`Total occurrences of '${searchSubstring}':`, totalOccurrences);
        }
    });

    worker.on('error', (err) => {
        console.error(`Error: ${err}`);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });

    workers.push(worker);
}

