// server.js
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 5000;

const db = mysql.createConnection({
    host: 'db',
    user: 'user',
    password: 'resu',
    database: 'messages'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the MySQL database');
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/message', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('Missing message');
    }
    const query = "INSERT INTO messages (message) VALUES ('" + message + "')";

    db.query(query, [], (err, results) => {
        res.status(201).send('Message sent.');
    });
});

// Handle Ctrl-C to exit
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        db.end(() => {
            console.log('Database connection closed');
            process.exit(0);
        });
    });
});

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});