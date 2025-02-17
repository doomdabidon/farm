const fs = require('fs');

process.on('message', ({ filePath }) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            process.send(`Error reading file: ${err.message}`);
        } else {
            process.send(data);
        }
        process.exit();
    });
});
