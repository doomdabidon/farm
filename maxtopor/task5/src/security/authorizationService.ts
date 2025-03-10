import bcrypt from 'bcryptjs'
import userRepository from '../datasource/userRepository'
import rolesRepository from '../datasource/rolesRepository'
import { User } from './user'

async function authorize(username: string, password: string): Promise<any> {
    const user = await userRepository.getUser(username)

    if (!user) {
        throw new AuthorizationError("Wrong username or password")
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        throw new AuthorizationError("Wrong username or password")
    }

    return {
        username: user.name,
        roles: user.roles
    }
}

async function register(username: string, password: string): Promise<any> {
    const exists = await userRepository.exists(username)

    if (exists) {
        throw Error("User with such name already registered")
    }

    const roles = await rolesRepository.getRoles()

    const user: User = {
        name: username,
        password: await bcrypt.hash(password, 10),
        roles: [roles[Math.floor((Math.random() * roles.length))]]
    }

    userRepository.saveUser(user)

    return {
        username: user.name,
        roles: user.roles
    }
}

export class AuthorizationError extends Error {
    constructor(message: string | undefined) {
        super(message)
        this.name = "AuthorizationError"
    }
}

export default {
    authorize,
    register
}