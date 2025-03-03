const bcrypt = require('bcryptjs');

const availableRoles = ["USER", "ADMIN"]

const users = [
    {
        username: "maxtopor",
        password: "$2b$10$TEQaYjuhWdf2T4nc6nU.mOLO6KHfRQT5J2aefxWUj3Fvfprmn9Fo2", //abc
        roles: ["USER"]
    },
    {
        username: "maxtoporadmin",
        password: "$2b$10$ugs0nUukmlurGVkZ3Y66.OxIyHSmpGZHbQFl1YafMvdaHYkuWInqa", //strongabc
        roles: ["USER", "ADMIN"]
    }
]

async function authorize(username, password) {
    const user = users.find(user => user.username === username)

    if (!user) {
        throw new AuthorizationError("Wrong username or password")
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        throw new AuthorizationError("Wrong username or password")
    }

    return {
        username: user.username,
        roles: user.roles
    }
}

async function register(username, password) {
    if (users.find(user => user.username === username)) {
        throw Error("User with such name already registered")
    }

    const user = {
        username: username,
        password: await bcrypt.hash(password, 10),
        roles: availableRoles[Math.floor((Math.random() * availableRoles.length))]
    }

    users.push(user)

    return {
        username: user.username,
        roles: user.roles
    }
}

class AuthorizationError extends Error {
    constructor(message) {
        super(message)
        this.name = "AuthorizationError"
    }
}

module.exports = {
    authorize,
    register,
    AuthorizationError
}