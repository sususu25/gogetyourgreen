const express = require('express');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// In-memory user store for now
const users = [];
let currentId = 1;

// POST /register - Register a new user
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = { id: currentId++, email, password }; // In a real app, hash the password!
    users.push(newUser);
    
    console.log('Users:', users);
    res.status(201).json({ id: newUser.id, email: newUser.email });
});

// POST /login - Log a user in
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // In a real app, return a JWT token
    res.status(200).json({ message: 'Login successful', userId: user.id });
});


app.listen(port, () => {
    console.log(`User service listening at http://localhost:${port}`);
}); 