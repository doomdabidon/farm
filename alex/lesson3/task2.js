// 2) написать функцию чтения файлов в отдельном файле.
// Создать через child_process.fork процесс и в нём исполнить эту функцию, результат
// чтения файла передать в главный поток и вывести на экран.
const { fork } = require("child_process");
const childProcess = fork(`${__dirname}/readFS.js`);

childProcess.send({});
childProcess.on('message', message => {
 console.log('message', message);
})