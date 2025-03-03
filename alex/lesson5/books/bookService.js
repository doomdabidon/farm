const bookRepository = require('./bookRepository.js');

function getAllBooks() { return bookRepository.getAllBooks(); };

function getBookById(id) {
    return bookRepository.getAllBooks().find(val => val.id === parseInt(id));
};

function getAllBooksByAuthor(name) {
    const author = bookRepository.getAllAuthros().find(val => val.name === name);
    console.log(author);
    return bookRepository.getAllBooks().filter(val => val.authorId === parseInt(author.id));

};

function addBook(book) {
    let books = bookRepository.getAllBooks();
    books.push(book);
    bookRepository.writeAllBooks(books);
};

function updateBook(book) {
    let books = bookRepository.getAllBooks();
    books[books.findIndex(val => val.id == parseInt(book.id))] = book;
    bookRepository.writeAllBooks(books);
};

function deleteBook(id) {
    let books = bookRepository.getAllBooks();
    books.splice(books.findIndex(val => val.id === parseInt(id)), 1);
    bookRepository.writeAllBooks(books);
};

module.exports = { getAllBooks, getAllBooksByAuthor, getBookById, addBook, updateBook, deleteBook }
