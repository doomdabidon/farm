import { AppDataSource } from '../db/data-source';
import { Author } from '../db/entity/author';

const authorRepository = AppDataSource.getRepository(Author);

async function findAllAuthors() {
    return await authorRepository.find();
}

async function saveAuthor(author: Author) {
    return (await authorRepository.save(author));
}

async function findAuthorById(id: number) {
    return await authorRepository.findOneBy({
        id: id
    })
}

async function update(author: Author, id: number) {
    return await authorRepository.update(id, author);
}
async function deleteAuthorById(id: number) {
    return await authorRepository.delete(id)
}

export default { deleteAuthorById, update, findAuthorById, saveAuthor, findAllAuthors }

