import jwt from 'jsonwebtoken';
const SECRET_KEY = 'd90fd63f-7db8-4716-b014-31fee261111';

export function verify(token: string): any {
    return jwt.verify(token, SECRET_KEY)
}

export function sign(username: string, roleSelected: string): any {
    return jwt.sign({ username, roleSelected }, SECRET_KEY)
}