// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const escape = require('escape-html');
const app = express();
const port = 5000;

const db = new sqlite3.Database('db.sqlite3');

app.get('/', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).send('Missing id');
    }
    const query = "SELECT * FROM users WHERE id=" + escape(id);

    db.get(query, [], (err, row) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        if (!row) {
            return res.status(404).send('User not found');
        }
        res.status(200).send("The user exists!");
    });
});

// Handle Ctrl-C to exit
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        db.close(() => {
            console.log('Database connection closed');
            process.exit(0);
        });
    });
});

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});