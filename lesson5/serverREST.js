const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
// const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { z } = require("zod");
const YAML = require('yamljs');
const path = require('path');

// const { router } = require('./userRoute');
// const { errorHandlerMiddleware } = require('./middleware');


// error
class ValidationError extends Error {
    constructor(message){
        super(message);
        this.name = 'ValidationError';
    }
};


// middleware


const AUTH_WHITELIST = [
    'Bearer valid-token-1',
    'Bearer valid-token-2'
];

const validationMiddleware = ({ querySchema, paramSchema, bodySchema }) => {
    return (req, res, next) => {
        if (querySchema) {
            const validationResult = querySchema.safeParse(req.query)
            !validationResult.success ? res.status(400).send(validationResult.error) : undefined;
        }

        if (paramSchema) {
            const validationResult = paramSchema.safeParse(req.params)
            !validationResult.success ? res.status(400).send(validationResult.error) : undefined;

        }

        if (bodySchema) {
            const validationResult = bodySchema.safeParse(req.body)

            if (!validationResult.success) {
                throw new ValidationError(validationResult.error)
            }
        }

        next();
    }; 
}

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (AUTH_WHITELIST.includes(authHeader)) {
        return next();
    }
    res.status(301).send('Unauthorized');
};

const errorHandlerMiddleware = (err, req, res, next) => {
   if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
   }

   res.status(500).json({ error: `${err}` || "Internal Server Error" });
};


// validator

const getUserQuerySchema = z.object({
    id: z.string().min(1, "Id min length is 1").max(5),
});

const postUserBodySchema = z.object({
    user: z.object({
         name: z.string().min(1, "name min length is 1").max(10),
         password: z.string().min(1).max(10),
         profession: z.string().min(1).max(10).optional(),
    })
});



// user router


const router = express.Router();

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

router.get('/secured', authMiddleware, (req, res) => res.json(users));
router.get('/', (req, res) => res.json(users));
router.get('/:id', validationMiddleware({ paramSchema: getUserQuerySchema }), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users[`user${req.params.id}`]));
});
router.post('/', validationMiddleware({ bodySchema: postUserBodySchema }), (req, res) => {
    const id = Math.round(Math.random() * 1000);
    users[`user${id}`] = { ...req.body.user, id };
    res.json(users);
});
router.delete('/:id', (req, res) => {
    delete users[`user${req.params.id}`];
    res.json(users);
});
router.put('/:id', (req, res) => {
    throw new Error('test');
    users[`user${req.params.id}`] = req.body;
    res.json(users);
});


const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({  extended: true }));


  
app.use('/users', router);

const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandlerMiddleware);

app.listen(5000, function () {
   console.log('Express App running at http://127.0.0.1:5000/');
});