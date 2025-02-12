// Задание 2:
// Написать программу для чтения и записи файлов используя библиотеку для генерации данных:

// Принимаем из командной строки значение -o filename иили -i filename
// Если есть -i читаем файл по этому пути и выводим на экран
// Если есть -o генерируем файл с названием, который мы предали и расширением txt и нагенериваем туда любых данных из библиотеки
// Для любой из команд, на ваше усмотрение, чтение или записи используйте read/write stream
const writeFs = require('./writeFS.js')
const readFs = require('./readFS.js')

const args = process.argv.slice(2);
console.log('Parsed Arguments:', args);

if (args[0] && args[0] === '-o' && args[1]) {
    writeFs.writeFile(args[1]);
}
else if (args[0] && args[0] === '-i' && args[1]) {
    readFs.readFile(args[1]);
} else {
    console.log('Wrong arguments');
    return;
}
