const bcrypt = require('bcrypt');
const express = require('express');

const path = require('path');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ---------- In-memory "database" ----------
let users = [];
let nextId = 1;

// ---------- Helpers ----------
const findUserById = (id) => users.find(u => u.id === id);

const findUserByEmail = (email) =>
    users.find(u => u.email.toLowerCase() === String(email).toLowerCase());

// Strip password before sending to the client
const sanitizeUser = (user) => {
    const { password, ...safe } = user;
    return safe;
};

// ---------- User CRUD Routes ----------

// GET /api/users - List all users
app.get('/api/users', (req, res) => {
    res.json(users.map(sanitizeUser));
});

// PLACE THE POST ROUTE HERE
app.post('/api/users', async (req, res) => {
    // Put the validation code here first.

    // Hash the password before storing it.
    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
        id: nextId++,
        name,
        email,
        password: hashed,
        role: normalizedRole
    };

    users.push(newUser);

    res.status(201).json(sanitizeUser(newUser));
});

// GET /api/users/:id - Get user by ID

app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({
            error: 'Invalid user ID.'
        });
    }

    const user = findUserById(id);

    if (!user) {
        return res.status(404).json({
            error: 'User not found.'
        });
    }

    res.json(sanitizeUser(user));
});

// ---------- Start Server ----------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Login page: http://localhost:${PORT}/login.html`);
});