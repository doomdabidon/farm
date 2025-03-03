const userRepository = require('./userRepository.js');
const bcrypt = require('bcryptjs');
const roles = ["admin", "user"];
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'd90fd63f-7db8-4716-b014-31fee261111';

function getAllUsers() { return userRepository.getAllUsers(); };

function getUserById(id) {
    return userRepository.getAllUsers().find(val => val.id === parseInt(id));
};

function addUser(user) {
    let users = userRepository.getAllUsers();
    const { username, password, id } = user;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const random = Math.floor(Math.random() * roles.length);
    const roleSelected = roles[random];

    users.push({ id, username, password: hashedPassword, role: roleSelected });
    userRepository.writeAllUsers(users);

    return jwt.sign({ username, roleSelected }, SECRET_KEY);
};

function deleteUser(id) {
    let users = userRepository.getAllUsers();
    users.splice(users.findIndex(val => val.id === parseInt(id)), 1);
    userRepository.writeAllUsers(users);
};

module.exports = { getAllUsers, getUserById, addUser, deleteUser }
