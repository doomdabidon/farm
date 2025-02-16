const { fork } = require("child_process");
const childProcess = fork(`${__dirname}/forkFile.js`);

console.time('start');

childProcess.send({ number: 1259205423 });
childProcess.on('message', message => {
  console.timeEnd('start');
  console.log('message', message);
})

