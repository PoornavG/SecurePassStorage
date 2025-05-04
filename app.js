// app.js
const express = require('express');
const cors = require('cors');
const argon2 = require('argon2');
const crypto = require('crypto');
require('dotenv').config();

const { connectToDB, getDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB Atlas and start server
connectToDB().then(() => {
    db = getDB();
    app.listen(process.env.PORT || 3000, () => {
        console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
}).catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
});

// Salting logic
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
        console.error("Error hashing password:", err);
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
        console.error("Error verifying password:", err);
        throw err;
    }
}

// Register User
app.post('/user-pass', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await db.collection('user_password').findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const hashedPassword = await hashPassword(username, password);
        const result = await db.collection('user_password').insertOne({ username, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: 'Could not create a new user' });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.collection('user_password').findOne({ username });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isPasswordValid = await verifyPassword(user.password, username, password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        res.status(200).json({ message: 'Login successful', username });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Username Check
app.get('/check-username/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await db.collection('user_password').findOne({ username });
        res.status(200).json({ exists: !!user });
    } catch (err) {
        res.status(500).json({ error: 'Username check failed' });
    }
});
