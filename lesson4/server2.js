const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'static', 'index2.html'));
})

app.post('/process_post', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   const response = {
      first_name:req.body.first_name,
      last_name:req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

const server = app.listen(5000, function () {
   console.log('Express App running at http://127.0.0.1:5000/');
})