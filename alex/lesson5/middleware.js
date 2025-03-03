const ValidationError = require("./validationError.js");

const validatorHandler = ({ querySchema, paramSchema, bodySchema }) => {
    return (req, res, next) => {
        if (querySchema) {
            const validationResult = querySchema.safeParse(req.query)
            if (!validationResult.success) {
                throw new ValidationError(validationResult.error);
            }
        }

        if (paramSchema) {
            const validationResult = paramSchema.safeParse(req.params)
            if (!validationResult.success) {
                throw new ValidationError(validationResult.error);
            }
        }

        if (bodySchema) {
            const validationResult = bodySchema.safeParse(req.body)
            if (!validationResult.success) {
                throw new ValidationError(validationResult.error);
            }
        }

        next();
    };
}

const errorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
};

module.exports = { errorHandler, validatorHandler }