const readline = require('readline');
const { faker } = require('@faker-js/faker');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const coding = 'utf-8';
const supportMethods = ['-o', '-i']

rl.question(`Введите ${supportMethods.join(' или ')}  и название текстового файла: `, (data) => {
    const [method, name] = data.split(' ');

    if(supportMethods.includes(method) && name) {
        method === '-i' ? readFile(name) : generateFile(name);
    } else {
        console.log("Не верно переданы параметры");
    }
    rl.close();
});

function getFullFileName(name) {
    return `${name}.txt`;
} 
    
function readFile(name) {
    const readableStream = fs.createReadStream(getFullFileName(name), coding);

    readableStream.on('data', chunk => {
        console.log("Читаем кусок данных:", chunk);
    });
    
    readableStream.on('end', () => {
        console.log("Чтение завершено");
    });

    readableStream.on('error', err => {
        console.error("Ошибка при чтении файла:", err.message);
    });
}

function generateFile(name) {
    const writableStream = fs.createWriteStream(getFullFileName(name), coding);
    writableStream.write(faker.lorem.text());
    writableStream.end();
}