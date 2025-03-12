import { AppDataSource } from '../db/data-source';
import { Book } from '../db/entity/book';

const bookRepository = AppDataSource.getRepository(Book);

async function findAllBooks() {
    return await bookRepository.find({
        relations: {
            author: true
        }
    });
}

async function saveBook(book: Book) {
    return (await bookRepository.save(book));
}

async function findBookById(id: number) {
    return await bookRepository.findOne({
        where: {
            id: id
        },
        relations: {
            author: true
        }

    })
}

async function findBookByAuthorName(authorName: string) {
    return await bookRepository.createQueryBuilder("book")
        .leftJoinAndSelect("book.author", "author")
        .where("author.name like :name", { name: authorName })
        .getMany();
}

async function update(book: Book, id: number) {
    return await bookRepository.update(id, book);
}
async function deleteBookById(id: number) {
    return await bookRepository.delete(id)
}

export default { deleteBookById, update, findBookById, findAllBooks, saveBook, findBookByAuthorName }

