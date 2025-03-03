const { AuthorizationError } = require("./authorizationService")
const jwtUtils = require("./jwtUtils")

class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
    }
}

function authenticationHandler(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const decoded = jwtUtils.decodeJwt(token)
        console.log("Decoded user", decoded)

        req.user = decoded
        next()
    } catch {
        res.status(401).json({ error: 'Invalid token' })
    }
}

function authorizationHandler(role) {
    return (req, res, next) => {
        console.log(req.user, role)

        if (!req.user.roles.includes(role)) {
            return res.status(403).json({ error: "Forbidden" })
        }
        
        next()
    }
}

function errorHandler(err, req, res, next) {
    if (err instanceof ValidationError) {
        res.status(500).json({
            message: err.message,
            trace: err.stack
        })
    }

    if (err instanceof AuthorizationError) {
        res.status(401).json({
            message: `Authorization error: ${err.message}`,
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
    payloadValidator,
    authenticationHandler,
    authorizationHandler
}