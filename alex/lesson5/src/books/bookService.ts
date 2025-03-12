import { Book } from "../db/entity/book";
import bookRepository from "./bookRepository";

async function getAllBooks() { return await bookRepository.findAllBooks(); };

async function getBookById(id: number) {
    return await bookRepository.findBookById(id);
};

async function getAllBooksByAuthor(name: string) {
    return await bookRepository.findBookByAuthorName(name);
};

async function addBook(book: Book) {
    return await bookRepository.saveBook(book);
};

async function updateBook(id: number, book: Book) {
    await bookRepository.update(book, id);
};

async function deleteBook(id: number) {
    await bookRepository.deleteBookById(id);
};

export default { getAllBooks, getBookById, addBook, updateBook, deleteBook, getAllBooksByAuthor }
