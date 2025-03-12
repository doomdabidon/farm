import express from 'express';
import { authenticate, authorize } from '../users/authMiddleware';
import { validatorHandler } from '../middleware';
import authorService from './authorService';
import { idValidator } from '../validators/idValidator';
import { authorBodyValidator } from './authorValidator';

const router = express.Router();

router.get('/',
    authenticate,
    async (req, res) => {
        res.json(await authorService.getAllAuthors())
    });

router.get('/:id',
    authenticate,
    validatorHandler({ paramSchema: idValidator }),
    async (req, res) => {
        res.json(await authorService.getAuthorById(parseInt(req.params.id)))
    });

router.post('/',
    authenticate,
    authorize('admin'),
    validatorHandler({ bodySchema: authorBodyValidator }),
    async (req, res) => {
        const author = await authorService.addAuthor(req.body);
        res.status(200).send({ message: 'Author is added', author });
    });

router.delete('/:id',
    authenticate,
    authorize('admin'),
    validatorHandler({ paramSchema: idValidator }),
    async (req, res) => {
        await authorService.deleteAuthor(parseInt(req.params.id));
        res.status(200).send({ message: 'Deleted' });
    });

router.put('/:id',
    validatorHandler(
        {
            paramSchema: idValidator,
            bodySchema: authorBodyValidator
        }),
    async (req, res) => {
        const author = await authorService.updateAuthor(parseInt(req.params.id), req.body);
        res.status(200).send({ message: 'Author is updated', author });
    });

export { router as authorRouter }