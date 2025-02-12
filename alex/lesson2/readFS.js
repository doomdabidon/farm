// Задание 2:
// Написать программу для чтения и записи файлов используя библиотеку для генерации данных:

// Принимаем из командной строки значение -o filename иили -i filename
// Если есть -i читаем файл по этому пути и выводим на экран
// Если есть -o генерируем файл с названием, который мы предали и расширением txt и нагенериваем туда любых данных из библиотеки
// Для любой из команд, на ваше усмотрение, чтение или записи используйте read/write stream

const fs = require('fs')

function readFile(name) {
    const stream = fs.createReadStream('./alex/lesson2/' + name + '.txt', { encoding: 'utf-8' });
    console.log("Starting file reading.")
    stream
        .on('data', chunk => {
            console.log(chunk.toString());
        })
        .on('end', () => {
            console.log('Finished file reading.')
        })
        .on('error', error => {
            console.log(`Error during file reading ${error}.`);
        });
}

module.exports = { readFile }