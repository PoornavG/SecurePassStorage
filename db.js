// db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);


let db;

async function connectToDB() {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME || 'SecurePassStorage');
        console.log("✅ Connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error("DB not initialized. Call connectToDB() first.");
    }
    return db;
}

module.exports = { connectToDB, getDB };