class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
    }
}

function errorHandler(err, req, res, next) {
    if (err instanceof ValidationError) {
        res.status(500).json({
            message: err.message,
            trace: err.stack
        })
    }

    res.status(500).json({
        message: err.message
    })
}

function payloadValidator(req, res, next) {
    const game = req.body
    
    if (!game.name) {
        throw new ValidationError("Game name should be provided")
    }

    next()
}

module.exports = {
    errorHandler,
    payloadValidator
}