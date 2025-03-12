import authorRepository from './authorRepository';
import { Author } from '../db/entity/author';

async function getAllAuthors() { return await authorRepository.findAllAuthors(); };

async function getAuthorById(id: number) {
    return await authorRepository.findAuthorById(id);
};

async function addAuthor(author: Author) {
    return await authorRepository.saveAuthor(author);
};

async function deleteAuthor(id: number) {
    return await authorRepository.deleteAuthorById(id);
};

async function updateAuthor(id: number, author: Author) {
    return await authorRepository.update(author, id);
}

export default { deleteAuthor, addAuthor, getAllAuthors, getAuthorById, updateAuthor }

