import express from 'express';
import { authenticate, authorize } from './authMiddleware';
import { validatorHandler } from '../middleware';
import { userBodyValidator, userLoginValidator } from './userValidator';
import userService from './userService';
import { idValidator } from '../validators/idValidator';
const router = express.Router();

router.get('/',
    authenticate,
    authorize('admin'),
    async (req, res) => {
        res.json(await userService.getAllUsers())
    });

router.get('/:id',
    authenticate,
    authorize('admin'),
    validatorHandler({ paramSchema: idValidator }),
    async (req, res) => {
        res.json(await userService.getUserById(parseInt(req.params.id)))
    });

router.post('/',
    validatorHandler({ bodySchema: userBodyValidator }),
    async (req, res) => {
        const token = await userService.addUser(req.body);
        res.status(200).send({ message: 'User added', token });
    });

router.delete('/:id',
    authenticate,
    authorize('admin'),
    validatorHandler({ paramSchema: idValidator }),
    async (req, res) => {
        await userService.deleteUser(req.params.id);
        res.status(200).send({ message: 'Deleted' });
    });

router.put('/:id',
    authenticate,
    authorize('admin'),
    validatorHandler({
        paramSchema: idValidator,
        bodySchema: userBodyValidator
    }),
    async (req, res) => {
        const user = await userService.update(parseInt(req.params.id), req.body);
        res.status(200).send({ message: 'User is updated', user });
    });


router.post('/login',
    validatorHandler({ bodySchema: userLoginValidator }),
    async (req, res) => {
        const token = await userService.login(req.body);
        res.status(200).send({ message: 'User loged in', token });
    });

export { router as userRouter }