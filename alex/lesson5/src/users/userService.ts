import bcrypt from 'bcryptjs';
import userRepository from './userRepository';
import { UserNotFoundError } from './userNotFoundError';
import { sign } from './jwtService';
import { User } from '../db/entity/user';

const roles = ["admin", "user"];

async function getAllUsers() { return await userRepository.findAllUsers(); };

async function getUserById(id: number) {
    return await userRepository.findUserById(id);
};

async function addUser(user: User) {
    const { username, password } = user;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const random = Math.floor(Math.random() * roles.length);
    const roleSelected = roles[random];

    await userRepository.saveUser({ username, password: hashedPassword, role: roleSelected } as User)

    return sign(username, roleSelected);
};

async function deleteUser(id: number) {
    await userRepository.deleteUserById(id);
};

async function update(id: number, user: User) {
    await userRepository.update(id, user);
}

async function login(user: User) {
    const { username, password } = user;
    const userSelected = await userRepository.findUserByUsername(username);

    console.log(userSelected);

    if (!userSelected) return new UserNotFoundError;

    const isValid = bcrypt.compareSync(password, userSelected.password);
    if (!isValid) return new UserNotFoundError;

    return sign(username, userSelected.role);
}

export default { login, deleteUser, addUser, getAllUsers, getUserById, update }

