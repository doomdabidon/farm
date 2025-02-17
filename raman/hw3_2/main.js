const { fork } = require('child_process');
const path = require('path');

const filePath = path.join(__dirname, 'example.txt');

const child = fork(path.join(__dirname, 'fileReader.js'));

child.send({ filePath });

child.on('message', (data) => {
    console.log('File Content:', data);
});

child.on('error', (err) => {
    console.error('Child Process Error:', err);
});

child.on('exit', (code) => {
    if (code !== 0) {
        console.error(`Child process exited with code ${code}`);
    }
});
