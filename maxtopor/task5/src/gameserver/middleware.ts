import { NextFunction } from "express"
import { AuthorizationError } from "../security/authorizationService"
import { decodeJwt } from "./jwtUtils"
import { Role } from "../security/role"

export class ValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "ValidationError"
    }
}

export function authenticationHandler(req: any, res: any, next: NextFunction) {
    const token = req.header('Authorization')?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const decoded = decodeJwt(token)
        console.log("Decoded user", decoded)

        req.user = decoded
        next()
    } catch {
        res.status(401).json({ error: 'Invalid token' })
    }
}

export function authorizationHandler(role: string) {
    return (req: any, res: any, next: NextFunction) => {
        const roles: Role[] = req.user.roles

        if (!roles.find(r => r.name === role)) {
            return res.status(403).json({ error: "Forbidden" })
        }

        next()
    }
}

export function errorHandler(err: Error, req: any, res: any, next: NextFunction): void {
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
        message: err.message,
        trace: err.stack
    })
}

export function payloadValidator(req: any, res: any, next: NextFunction): void {
    const game = req.body

    if (!game.name) {
        throw new ValidationError("Game name should be provided")
    }

    next()
}
