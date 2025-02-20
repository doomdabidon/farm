import { ValidationError } from('./errors');

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

   res.status(500).json({ error: "Internal Server Error" });
};

export { errorHandlerMiddleware, authMiddleware, validationMiddleware }