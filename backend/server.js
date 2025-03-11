// server.js
const express = require('express');
const mysql = require('mysql2');
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
    user: 'root',
    password: '',
    database: 'myapp'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
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

    // Input validation
    if (!user.name || !user.email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id: result.insertId, ...user });
    });
});


app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = req.body;

    // Input validation
    if (!user.name || !user.email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    db.query('UPDATE users SET ? WHERE id = ?', [user, id], (err) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id, ...user });
    });
});


app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ id });
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
