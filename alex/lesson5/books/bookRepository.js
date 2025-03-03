const fsExtra = require('fs-extra');
const booksPath = __dirname + '../db/book.json';
const books = require('../db/book.json');
const authors = require('../db/authors.json');

function writeJson(path, data) {
    fsExtra.writeJSON(path, data, (error) => {
        if (error) {
            console.log('An error has occurred');
            return;
        }
        console.log('Data written to file successfully ');
    });
}

function getAllBooks() {
    return books;
}
function getAllAuthros() {
    return authors;
}
function writeAllBooks(books) {
    writeJson(booksPath, books);
}

module.exports = { getAllAuthros, getAllBooks, writeAllBooks }