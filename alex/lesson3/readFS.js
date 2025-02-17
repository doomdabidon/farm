const fs = require('fs')
process.on('message', () => {
    const stream = fs.createReadStream('./alex/lesson3/1.txt', { encoding: 'utf-8' });
    console.log("Starting file reading.")
    stream
        .on('data', chunk => {
            process.send(chunk.toString());
            process.exit();
        })
        .on('end', () => {
            console.log('Finished file reading.')
        })
        .on('error', error => {
            console.log(`Error during file reading ${error}.`);
        });
})

