const jwt = require('jsonwebtoken')
const SECRET_KEY = "vnYwV4ULtYFeKRiYNvg54E68D0vLZgFq7QTOAoodpII="

function generateJwt(username, roles) {
    const token = jwt.sign({ username: username, roles: roles }, SECRET_KEY)

    return token
}

function decodeJwt(token) {
    const decoded = jwt.verify(token, SECRET_KEY)

    return decoded
}

module.exports = {
    generateJwt,
    decodeJwt
}