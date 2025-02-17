const { exec } = require("child_process");
console.time('start');

exec(`node ${__dirname}/spawnFile.js`, ((err, stdout) => {
    console.log(`stdout: ${stdout}`);
    console.timeEnd('start');
}));
