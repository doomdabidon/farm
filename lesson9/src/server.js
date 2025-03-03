const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());      

const pool = new Pool({
    host: process.env.POSTGRESDB_HOST,
    port: process.env.POSTGRESDB_LOCAL_PORT,
    user: process.env.POSTGRESDB_USER,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    database: process.env.POSTGRESDB_DATABASE,
});

app.get('/', (req, res) => res.json({ message: 'hi' }));
app.post('/database/setup', async (req, res) => {
    const client = await pool.connect();
    try {

        await client.query('CREATE TABLE farm( id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))')
        res.status(200).json({ message: 'Successfully created table' });
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    } finally {
        client.release();
    }
});
app.post('/database', async (req, res) => {
    const client = await pool.connect();

    const { name, location } = req.body
    try {
        await client.query('INSERT INTO farm (name, address) VALUES ($1, $2)', [name, location])
        res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    } finally {
        client.release();
    }
});
app.get('/database', async (req, res) => {
    const client = await pool.connect();

    try {
        const result = await client.query('SELECT * FROM farm');
        res.status(200).json({ result })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    } finally {
        client.release();
    }
});

app.listen(8080, function () {
   console.log(`Express App running at http://127.0.0.1:${process.env.NODE_DOCKER_PORT}/`);
});