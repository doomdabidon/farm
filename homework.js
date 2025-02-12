const args = require("args-parser")(process.argv);
const fs = require("fs");
const { faker } = require("@faker-js/faker");

const readFile = (file) => {
  try {
    const readStream = fs.createReadStream(file, "utf-8");

    async function logChunks(readStream) {
      for await (const chunk of readStream) {
        console.log(chunk);
      }
    }

    logChunks(readStream);
  } catch (error) {
    console.log(error);
  }
};

const writeFile = (file) => {
  try {
    const fakeData = faker.lorem.words();

    const writeStream = fs.createWriteStream(file, "utf-8");

    writeStream.on("open", () => {
      writeStream.write(fakeData);
    });

    readFile(file);
  } catch (error) {
    console.log(error);
  }
};

if (!!args.i) {
  readFile(args.i);
} else if (!!args.o) {
  writeFile(args.o);
}
