import { AppDataSource } from '../db/data-source';
import { User } from '../db/entity/user';

const userRepository = AppDataSource.getRepository(User);

async function findAllUsers() {
    return await userRepository.find();
}

async function saveUser(user: User) {
    return (await userRepository.save(user));
}

async function findUserById(id: number) {
    return await userRepository.findOneBy({
        id: id
    })
}
async function findUserByUsername(username: string) {
    return await userRepository.findOneBy({
        username: username
    })
}
async function update(id: number, user: User) {
    return await userRepository.update(id, user);
}
async function deleteUserById(id: number) {
    return await userRepository.delete(id)
}

export default { deleteUserById, update, saveUser, findAllUsers, findUserById, findUserByUsername }


