const fs = require('fs')
process.on("message", () => {
    fs.readFile('./alex/lesson3/1.txt', { encoding: 'utf-8' }, (error, con) => {
        process.send(con.toString());
        process.exit();
    })
});

