// app.js
const express = require('express');
const cors = require('cors');
const argon2 = require('argon2');
const crypto = require('crypto');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

const { connectToDB, getDB } = require('./db');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// 🧠 Utility Functions
async function salting(salt, password) {
    const part1 = salt.substring(0, Math.floor(salt.length / 3));
    const part2 = salt.substring(Math.floor(salt.length / 3), Math.floor(2 * salt.length / 3));
    const part3 = salt.substring(Math.floor(2 * salt.length / 3));
    const middleIndex = Math.floor(password.length / 2);
    return part1 + password.substring(0, middleIndex) + part2 + password.substring(middleIndex) + part3;
}

async function hashPassword(user, pass) {
    try {
        const salt = crypto.createHash('sha256').update(user).digest('hex');
        const salted = await salting(salt, pass);
        return await argon2.hash(salted, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 5,
            parallelism: 2
        });
    } catch (err) {
        console.error("❌ Error hashing password:", err);
        throw err;
    }
}

async function verifyPassword(hashedPassword, salt, inputPassword) {
    try {
        const sal = crypto.createHash('sha256').update(salt).digest('hex');
        const salted = await salting(sal, inputPassword);
        return await argon2.verify(hashedPassword, salted, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 5,
            parallelism: 2
        });
    } catch (err) {
        console.error("❌ Error verifying password:", err);
        throw err;
    }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 🟢 Connect to DB and Start Server
connectToDB().then(() => {
    db = getDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
}).catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
});

// ✅ Routes

// Health check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'SecurePassStorage API is running.' });
});

// Register User
app.post('/user-pass', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingUser = await db.collection('user_password').findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await hashPassword(username, password);
        const result = await db.collection('user_password').insertOne({ username, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (err) {
        console.error("❌ Signup error:", err);
        res.status(500).json({ error: 'Could not create a new user' });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || 'Unknown';
        const timestamp = new Date();
        let status = 'failure';

        if (!username || !password) {
            // Log attempt
            await db.collection('login_attempts').insertOne({ username, status, ip, location: 'Unknown', timestamp });
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await db.collection('user_password').findOne({ username });
        if (!user) {
            // Log attempt
            await db.collection('login_attempts').insertOne({ username, status, ip, location: 'Unknown', timestamp });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await verifyPassword(user.password, username, password);
        if (!isPasswordValid) {
            // Log attempt
            await db.collection('login_attempts').insertOne({ username, status, ip, location: 'Unknown', timestamp });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Success
        status = 'success';
        await db.collection('login_attempts').insertOne({ username, status, ip, location: 'Unknown', timestamp });
        const token = jwt.sign({ username: user.username, userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Username Availability Check
app.get('/check-username/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await db.collection('user_password').findOne({ username });
        res.status(200).json({ exists: !!user });
    } catch (err) {
        console.error("❌ Username check failed:", err);
        res.status(500).json({ error: 'Username check failed' });
    }
});

// Fetch login attempts for a user
app.get('/login-attempts/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const attempts = await db.collection('login_attempts')
            .find({ username })
            .sort({ timestamp: -1 })
            .toArray();
        res.status(200).json({ attempts });
    } catch (err) {
        console.error('❌ Failed to fetch login attempts:', err);
        res.status(500).json({ error: 'Failed to fetch login attempts' });
    }
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data.', user: req.user });
});

// Login function
async function login(username, password) {
  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    alert('Login successful!');
  } else {
    alert(data.error || 'Login failed');
  }
}

// Access protected route
async function getProtected() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/protected', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const data = await res.json();
  if (res.ok) {
    console.log('Protected data:', data);
  } else {
    alert('Access denied');
  }
}
