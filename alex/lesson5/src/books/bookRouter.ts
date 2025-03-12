import express from 'express';
const router = express.Router();

import bookService from './bookService';
import { validatorHandler } from '../middleware';
import { authenticate } from '../users/authMiddleware';
import { authorNameValidator } from '../authors/authorValidator';
import { bookBodyValidator } from './bookValidator';
import { idValidator } from '../validators/idValidator';

router.get('/',
    authenticate,
    async (req, res) => {
        res.json(await bookService.getAllBooks())
    });

router.get('/:id',
    authenticate,
    validatorHandler({ paramSchema: idValidator }),
    async (req, res) => {
        res.json(await bookService.getBookById(parseInt(req.params.id)))
    });

router.get('/author/:authorName',
    authenticate,
    validatorHandler({ paramSchema: authorNameValidator }),
    async (req, res) => {
        res.json(await bookService.getAllBooksByAuthor(req.params.authorName))
    });

router.post('/',
    authenticate,
    validatorHandler({ bodySchema: bookBodyValidator }),
    async (req, res) => {
        const book = await bookService.addBook(req.body);
        res.status(200).send({ message: 'Book is added', book });
    });

router.put('/:id',
    authenticate,
    validatorHandler({
        paramSchema: idValidator,
        bodySchema: bookBodyValidator
    }),
    async (req, res) => {
        const updatedBook = await bookService.updateBook(parseInt(req.params.id), req.body);
        res.status(200).send({ message: 'Book is updated', updatedBook });
    });

router.delete('/:id',
    authenticate,
    validatorHandler({ paramSchema: idValidator }),
    async (req, res) => {
        await bookService.deleteBook(parseInt(req.params.id));
        res.status(202).send({ message: 'Deleted' });
    });

export { router as bookRouter }