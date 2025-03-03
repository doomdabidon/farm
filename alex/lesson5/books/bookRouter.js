const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const bookService = require('./bookService.js');
const router = express.Router();
const middleware = require('../middleware.js');
const authorValidator = require('./authorValidator.js');
const bookValidator = require('./bookValidator.js');
const { authenticate } = require('../users/authMiddleware.js');

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 *     responses:
 *       200:
 *         description: A list of books.
 */
router.get('/', authenticate,
    (req, res) => {
        res.json(bookService.getAllBooks())
    });

/**
* @swagger
* /books/{id}:
*   get:
*     summary: Get book by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: A single book object.
*       400:
*         description: Validation error.
*       500:
*         description: Server error.
*/
router.get('/:id', [authenticate,
    middleware.validatorHandler({ paramSchema: bookValidator.bookIdValidator })],
    (req, res) => {
        res.json(bookService.getBookById(req.params.id))
    });

/**
* @swagger
* /books/{authorName}:
*   get:
*     summary: Get book by authorName
*     parameters:
*       - in: path
*         name: authorName
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: A list of book objects.
*       400:
*         description: Validation error.
*       500:
*         description: Server error.
*/
router.get('/author/:authorName', [authenticate,
    middleware.validatorHandler({ paramSchema: authorValidator.authorNameValidator })],
    (req, res) => {
        res.json(bookService.getAllBooksByAuthor(req.params.authorName))
    });

/**
* @swagger
* /books:
*   post:
*     summary: Create a new book
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Book'
*     responses:
*       200:
*         description: The created book.
*       400:
*         description: Validation error.
*       500:
*         description: Server error.
*/
router.post('/',
    [authenticate,
        jsonParser,
        middleware.validatorHandler({ bodySchema: bookValidator.bookBodyValidator })],
    (req, res) => {
        bookService.addBook(req.body);
        res.status(200).send('Added');
    });

/**
* @swagger
* /books:
*   put:
*     summary: Update a book
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Book'
*     responses:
*       200:
*         description: Book is updated.
*       400:
*         description: Validation error.
*       500:
*         description: Server error.
*/
router.put('/',
    [authenticate,
        jsonParser,
        middleware.validatorHandler({ bodySchema: bookValidator.bookBodyValidator })],
    (req, res) => {
        bookService.updateBook(req.body);
        res.status(200).send('Updated');
    });

/**
* @swagger
* /books/{id}:
*   delete:
*     summary: Delete a book
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Book deleted.
*       400:
*         description: Validation error.
*       500:
*         description: Server error.
*/
router.delete('/:id',
    [authenticate,
        middleware.validatorHandler({ paramSchema: bookValidator.bookIdValidator })],
    (req, res) => {
        bookService.deleteBook(req.params.id);
        res.status(202).send('Deleted');
    });

module.exports = { bookRouter: router }