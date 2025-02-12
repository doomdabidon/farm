// Задание 2:
// Написать программу для чтения и записи файлов используя библиотеку для генерации данных:

// Принимаем из командной строки значение -o filename иили -i filename
// Если есть -i читаем файл по этому пути и выводим на экран
// Если есть -o генерируем файл с названием, который мы предали и расширением txt и нагенериваем туда любых данных из библиотеки
// Для любой из команд, на ваше усмотрение, чтение или записи используйте read/write stream

const fs = require('fs');
const stream = require('stream');
const { faker } = require('@faker-js/faker');
const util = require('util');
const once = require('events');


const finished = util.promisify(stream.finished);

async function writeFile(name) {
    const file = fs.createWriteStream('./alex/lesson2/' + name + '.txt', { encoding: 'utf-8' });
    for await (const chunk of faker.string.alpha({ length: { min: 100, max: 1000 } })) {
        if (!file.write(chunk)) {
            await once(file, 'drain');
        }
    }
    file.end;

    await finished(file);

}

module.exports.writeFile = writeFile;