const express = require('express');
const { connectToDb, getDb } = require('./db');
const cors = require('cors');
const argon2 = require('argon2');
const crypto = require('crypto'); // Added crypto module

const app = express();
app.use(cors());
app.use(express.json());

let db;

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000');
        });
        db = getDb();
    }
});

// ... [Other routes remain unchanged] ...

async function salting(salt, password) {
    // Implementation remains the same
    const part1 = salt.substring(0, Math.floor(salt.length / 3));
    const part2 = salt.substring(Math.floor(salt.length / 3), Math.floor(2 * salt.length / 3));
    const part3 = salt.substring(Math.floor(2 * salt.length / 3));

    const middleIndex = Math.floor(password.length / 2);
    const salted = part1 + password.substring(0, middleIndex) + part2 + password.substring(middleIndex) + part3;

    return salted;
}

async function hashPassword(user, pass) {
    try {
        // Generate deterministic salt using SHA-256
        const salt = crypto.createHash('sha256').update(user).digest('hex');
        const salted = await salting(salt, pass);
        console.log(salted)
        try {
            const final = await argon2.hash(salted, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 5,
                parallelism: 2
            });
            return final;
        } catch (err) {
            console.error("Error salting password:", err);
            throw err;
        }

    } catch (err) {
        console.error("Error hashing password:", err);
        throw err;
    }
}

async function verifyPassword(hashedPassword, salt, inputPassword) {
    try {
        const sal = crypto.createHash('sha256').update(salt).digest('hex');
        const salted = await salting(sal, inputPassword);
        console.log(salted)
        const isMatch = await argon2.verify(hashedPassword, salted, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 5,
            parallelism: 2
        });
        return isMatch;
    } catch (err) {
        console.error("Error verifying password:", err);
        throw err;
    }
}



app.post('/user-pass', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const existingUser = await db.collection('user_password')
            .findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        console.log(username)
        // Hash the password
        const hashedPassword = await hashPassword(username, password);

        // Create user document
        const user = {
            username,
            password: hashedPassword
        };

        // Insert user
        const result = await db.collection('user_password').insertOne(user);

        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertedId
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: 'Could not create a new user' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await db.collection('user_password')
            .findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log(username)
        console.log(password)
        // Verify password
        const isPasswordValid = await verifyPassword(
            user.password,
            username,
            password
        );

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Successful login
        res.status(200).json({
            message: 'Login successful',
            username: user.username
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// User existence check route
app.get('/check-username/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await db.collection('user_password')
            .findOne({ username });

        res.status(200).json({ exists: !!user });
    } catch (err) {
        res.status(500).json({ error: 'Username check failed' });
    }
});