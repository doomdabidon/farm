const fs = require('fs');
const { Transform } = require('stream');
const csv = require('csv-parser');

const readStream = fs.createReadStream('lesson2/test.csv');
const writeStream = fs.createWriteStream('lesson2/output.csv');

const transformStream = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    chunk.city = chunk.city.toUpperCase(); // Example transformation
    callback(null, `${chunk.id},${chunk.name},${chunk.surname},${chunk.city}\n`);
  }
});

readStream
  .pipe(csv())
  .pipe(transformStream)
  .pipe(writeStream)
  .on('finish', () => console.log('CSV processing completed.'));