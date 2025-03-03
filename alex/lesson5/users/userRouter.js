const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const userService = require('./userService.js');
const userRouter = express.Router();
const middleware = require('../middleware.js');
const userValidator = require('./userValidator.js');
const { authenticate, authorize } = require('./authMiddleware.js');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users.
 */
userRouter.get('/',
    authenticate,
    authorize('admin'),
    (req, res) => {
        res.json(userService.getAllUsers())
    });

/**
* @swagger
* /users/{id}:
*   get:
*     summary: Get user by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: A single user object.
*       400:
*         description: Validation error.
*       500:
*         description: Server error.
*/
userRouter.get('/:id',
    authenticate,
    authorize('admin'),
    middleware.validatorHandler({ paramSchema: userValidator.userIdValidator }),
    (req, res) => {
        res.json(userService.getUserById(req.params.id))
    });

/**
* @swagger
* /users:
*   post:
*     summary: Create a new user
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/user'
*     responses:
*       200:
*         description: The created user.
*       400:
*         description: Validation error.
*       500:
*         description: Server error.
*/
userRouter.post('/',
    jsonParser,
    middleware.validatorHandler({ bodySchema: userValidator.userBodyValidator }),
    (req, res) => {
        const token = userService.addUser(req.body);
        res.status(200).send({ message: 'User added', token });
    });

/**
* @swagger
* /users/{id}:
*   delete:
*     summary: Delete a user
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: user deleted.
*       400:
*         description: Validation error.
*       500:
*         description: Server error.
*/
userRouter.delete('/:id',
    authenticate,
    authorize('admin'),
    middleware.validatorHandler({ paramSchema: userValidator.userIdValidator }),
    (req, res) => {
        userService.deleteUser(req.params.id);
        res.status(202).send('Deleted');
    });

module.exports = userRouter