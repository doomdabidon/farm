import { GamesDataSource } from "./datasource";
import { User } from "../security/user";

const repository = GamesDataSource.getRepository(User)

async function getUser(username: string) {
    const user = await repository.findOne({
        where: {
            name: username
        },
        relations: {
            roles: true
        }
    })

    return user
}

async function saveUser(user: User) {
    const entity = repository.create(user)
    const saved = await repository.save(entity)

    return saved
}

async function exists(username: string) {
    return await repository.existsBy({ name: username })
}

export default {
    getUser,
    saveUser,
    exists
}