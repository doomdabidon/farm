const express = require('express');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({  extended: true }));

const users = {
   user1: {
      name : 'mahesh',
      password : 'password1',
      profession : 'teacher',
      id: 1
   },
   user2: {
      name : 'suresh',
      password : 'password2',
      profession : 'librarian',
      id: 2
   },
   user3: {
      name : 'ramesh',
      password : 'password3',
      profession : 'clerk',
      id: 3
   }
 };


const AUTH_WHITELIST = [
    'Bearer valid-token-1',
    'Bearer valid-token-2'
];

// Middleware to check Authorization header
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (AUTH_WHITELIST.includes(authHeader)) {
        return next();
    }
    res.status(301).send('Unauthorized');
};    

app.get('/secured/users', authMiddleware, (req, res) => res.json(users));
app.get('/users', (req, res) => res.json(users));
app.get('/users/:id', (req, res) => {
   res.setHeader('Content-Type', 'application/json');
   res.end(JSON.stringify(users[`user${req.params.id}`]));
});

app.post('/users', (req, res) => {
   const id = Math.round(Math.random() * 1000);
   users[`user${id}`] = { ...req.body.user, id }
   res.json(users);
});

app.delete('/users/:id', (req, res) => {
   delete users[`user${req.params.id}`];
   res.json(users);
});

app.put('/users/:id', (req, res) => {
   users[`user${req.params.id}`] = req.body;
   res.json(users);
});

app.listen(5000, function () {
   console.log('Express App running at http://127.0.0.1:5000/');
});