const { workerData, parentPort } = require("worker_threads")

const subString = workerData.subString;
const findString = workerData.findString;

const count = (subString.match(new RegExp(findString, "g")) || []).length;

parentPort.postMessage(count);