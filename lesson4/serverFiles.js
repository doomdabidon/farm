const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
   res.send('Hello World');
})

const server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
})