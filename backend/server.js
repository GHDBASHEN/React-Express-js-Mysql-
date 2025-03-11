// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'myapp'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Routes
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/users', (req, res) => {
    const user = req.body;
    db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...user });
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = req.body;
    db.query('UPDATE users SET ? WHERE id = ?', [user, id], (err) => {
        if (err) throw err;
        res.json({ id, ...user });
    });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.json({ id });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});