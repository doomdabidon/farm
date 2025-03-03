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

function login(user) {
    console.log(user);
    const { username, password } = user;
    const userSelected = getAllUsers().find(val => val.username === username);
    console.log(userSelected);
    if (!userSelected) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = bcrypt.compareSync(password, userSelected.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    return jwt.sign({ username, role: userSelected.role }, SECRET_KEY, { expiresIn: "1h" });
}

module.exports = { getAllUsers, getUserById, addUser, deleteUser, login }
