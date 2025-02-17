const { parentPort, workerData } = require('worker_threads');
const { chunk, searchSubstring } = workerData;

function countOccurrences(text, subStr) {
    let count = 0;
    let index = text.indexOf(subStr);
    while (index !== -1) {
        count++;
        index = text.indexOf(subStr, index + subStr.length);
    }
    return count;
}

const count = countOccurrences(chunk, searchSubstring);


parentPort.postMessage(count);
