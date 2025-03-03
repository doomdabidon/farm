const fsExtra = require('fs-extra');
const usersPath = __dirname + '/../db/user.json';
const users = require('../db/user.json');

function writeJson(path, data) {
    fsExtra.writeJSON(path, data, (error) => {
        if (error) {
            console.log('An error has occurred');
            return;
        }
        console.log('Data written to file successfully ');
    });
}

function getAllUsers() {
    return users;
}

function writeAllUsers(users) {
    writeJson(usersPath, users);
}

module.exports = { getAllUsers, writeAllUsers }