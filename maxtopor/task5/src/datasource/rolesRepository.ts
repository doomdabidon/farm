import { GamesDataSource } from "./datasource";
import { Role } from "../security/role";

const repository = GamesDataSource.getRepository(Role)

async function getRoles() {
    return await repository.find()
}

export default {
    getRoles
}