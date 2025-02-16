const { exec } = require("child_process");
console.time('start');

exec('tree', ((err, stdout) => {
    console.log(`stdout: ${stdout}`);
    console.timeEnd('start');
}));
