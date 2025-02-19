const express = require('express');
const app = express();
const path = require('path');
const { faker } = require('@faker-js/faker');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const multer = require('multer');

// 1) сервер должен возвращать любую (на ваше усмотрение) html страничку
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/static', 'index1.html'));
})

// 2) Должен иметь возможность принять данные как в query так и body, соединить эти данные в 1 json
//  добавить рандмных полей из фейк библиотеки и вернуть на клиент.
app.post('/book', jsonParser, (req, res) => {
    console.log("Req: ", req.body)
    const response = {
        bookId: req.query.id,
        bookTitle: req.body.bookTitle,
        bookAuthor: req.body.bookAuthor,
        bookPublisher: faker.book.publisher(),
        bookGenre: faker.book.genre()
    }
    console.log("Response: ", response);
    res.end(JSON.stringify(response));
})

// 3) раздавать статические файлы всего самого сервера
app.use(express.static(__dirname + '/public'));

// 4) иметь возможность принять и записать файл (через стримы) и быть доступным в статических файлах
//  (можете написать html страничку с 1 полем - file)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/files')
        console.log(__dirname + '/public/files')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });

app.get('/file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/static', 'index2.html'));
})

app.post('/upload_page', upload.single('file'), (req, res, next) => {
    console.log(req.file);
    // res.redirect('/files/' + req.file.originalname);
    res.status(200).send('Uploaded, please try:' + '<a href="http://localhost:8081/files/' + req.file.originalname + '">link</a>');
})

const server = app.listen(8081, () => {
    console.log('Express App running at http://localhost:8081/');
})