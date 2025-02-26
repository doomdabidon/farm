// const express = require('express');
import express from 'express';
import { authMiddleware, validationMiddleware } from './middleware';
import { getUserQuerySchema, postUserBodySchema } from './validation';

const router = express.Router();

const users = {
   user1: {
      name : 'mahesh',
      password : 'password1',
      profession : 'teacher',
      id: 1
   },
   user2: {
      name : 'suresh',
      password : 'password2',
      profession : 'librarian',
      id: 2
   },
   user3: {
      name : 'ramesh',
      password : 'password3',
      profession : 'clerk',
      id: 3
   }
 };

/**
 * @swagger
 * /users/secured:
 *   get:
 *     summary: Retrieve a list of users (secured)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 */
router.get('/secured', authMiddleware, (req, res) => res.json(users));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users.
 */
router.get('/', (req, res) => res.json(users));

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
 */
router.get('/:id', validationMiddleware({ paramSchema: getUserQuerySchema }), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users[`user${req.params.id}`]));
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 */
router.post('/', validationMiddleware({ bodySchema: postUserBodySchema }), (req, res) => {
    const id = Math.round(Math.random() * 1000);
    users[`user${id}`] = { ...req.body.user, id };
    res.json(users);
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
 *         description: User deleted.
 */
router.delete('/:id', (req, res) => {
    delete users[`user${req.params.id}`];
    res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user (throws an error)
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       500:
 *         description: Test error.
 */
router.put('/:id', (req, res) => {
    throw new Error('test');
    users[`user${req.params.id}`] = req.body;
    res.json(users);
});

export { router };