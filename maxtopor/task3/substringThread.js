const { parentPort, workerData } = require("worker_threads");

const substringCount = workerData.source.split(workerData.substring).length-1
parentPort.postMessage(substringCount)