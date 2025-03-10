import jwt, { JwtPayload } from 'jsonwebtoken'

const SECRET_KEY = "vnYwV4ULtYFeKRiYNvg54E68D0vLZgFq7QTOAoodpII="

export function generateJwt(username: object, roles: string[]): string {
    const token = jwt.sign({ username: username, roles: roles }, SECRET_KEY, { expiresIn: "1h" })

    return token
}

export function decodeJwt(token: string): string | JwtPayload {
    const decoded = jwt.verify(token, SECRET_KEY)

    return decoded
}