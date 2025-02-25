const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const { z } = require('zod');
const YAML = require('yamljs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require("express-session");

const SECRET_KEY = 'd90fd63f-7db8-4716-b014-31fee2693ef7'; // Replace with env variable

const defaultTokenRateLimit = {
    windowMs: 15 * 60 * 1000,
    max: 50,
};

const tokenRateLimit = {
    ...defaultTokenRateLimit,
    keyGenerator: (req, res) => {
        return req.headers['authorization'];
    }
};

// const values
const args = process.argv.slice(2);
const port = Number.parseInt(args[0], 10);
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
const whitelist = ['http://localhost:5000'];
const corsOptions = {
    // origin: (origin, callback) => callback(null, whitelist.includes(origin))
        origin: (origin, callback) => whitelist.includes(origin) ? callback(null, true) : callback(new Error('Not allowed by CORS'))
};

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

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const authorize = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
    next();
};

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

   res.status(500).json({ error: `${err}` || 'Internal Server Error' });
};


// validator

const getUserQuerySchema = z.object({
    id: z.string().min(1, 'Id min length is 1').max(5),
});

const postUserBodySchema = z.object({
    user: z.object({
         name: z.string().min(1, 'name min length is 1').max(10),
         password: z.string().min(1).max(10),
         profession: z.string().min(1).max(10).optional(),
    })
});



// user router
const router = express.Router();

router.get('/protectedJWTadmin', authenticate, authorize('admin'), (req, res) => res.json(users));
router.get('/protectedJWT', authenticate, (req, res) => res.json(users));
router.get('/protectedSession', authenticate, (req, res) => res.json(users));


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

const accounts = [];
// auth router
const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    accounts.push({ username, password: hashedPassword, role });

    const token = jwt.sign({ username, role }, SECRET_KEY);

    res.status(201).json({ message: "User registered successfully", token });
});

authRouter.post('/login', async (req, res) => {
   const { username, password } = req.body;
    const user = accounts.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ username, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// session router

const sessionUsers = [{ id: 1, username: "admin", password: bcrypt.hashSync("password", 10) }];
const sessionRouter = express.Router();

sessionRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: "Invalid username or password" });

    req.session.user = { id: user.id, username: user.username }; // Store user session
    res.json({ message: "Login successful", sessionID: req.sessionID });
});

// Protected Route (Only logged-in users can access)
sessionRouter.get("/dashboard", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized. Please log in." });
    
    res.json({ message: "Welcome to Dashboard", user: req.session.user });
});

sessionRouter.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

sessionRouter.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));


// server
const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({  extended: true }));
app.use(helmet()); // Secures HTTP headers
app.use(cors(corsOptions));
app.use(rateLimit(defaultTokenRateLimit)); // Limits requests

app.options('*', cors(corsOptions))

app.use('/users', router);
app.use('/auth', authRouter);
app.use('/session', sessionRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandlerMiddleware);

app.listen(Number.parseInt(port, 10), function () {
   console.log('Express App running at http://127.0.0.1:5000/');
});