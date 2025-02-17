const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'static', 'index1.html'));
})

app.get('/process_get', function (req, res) {
   const response = {
      first_name:req.query.first_name,
      last_name:req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

const server = app.listen(5000, function () {
   console.log('Express App running at http://127.0.0.1:5000/');
})