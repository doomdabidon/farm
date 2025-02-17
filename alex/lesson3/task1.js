// 1) Написать функцию подсчёта вхождения подстроки в строке в отельном файле.
// Создайте несколько потоков через thread worker (от количества ядер процессора)
// Через faker сгенерируйте большую строку например 100000 символов и разделите
// ее между потоками поровну, в конце просуммируйте результат в главном файле. 
const { faker, en } = require('@faker-js/faker');
const { Worker } = require('worker_threads');
const cpuCount = require('os').cpus().length;
const genString = faker.string.alpha(100000);
const findString = 'abc'
const average = Math.floor(genString.length / cpuCount);

let list = [];
let start = 0;
let end = 0;
for (let i = 0; i <= cpuCount; i++) {
    if (i === cpuCount) { list.push(runWorker({ subString: genString.substring(start), findString: findString })); }
    list.push(runWorker({ subString: genString.substring(start, end += average), findString: findString }));
    start = end + 1;
}
Promise.all(list)
    .then(values => console.log(`Result count: ${values.reduce((accumulator, part) => accumulator + part, 0)}`));

function runWorker(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(`${__dirname}/subStringCounter.js`, { workerData })
        worker.on('message', resolve)
            .on('error', reject)
            .on('exit', code => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`))
                }
            })
    })
}
