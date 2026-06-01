/*jshint esversion: 8 */
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

let url = `${process.env.MONGO_URL}`;
let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(url);      

    try {
        // Task 1: Connect to MongoDB
        await client.connect();
        console.log("Connected successfully to server");

        // Task 2: Connect to database giftdb and store in variable dbInstance
        dbInstance = client.db(dbName);

        // Task 3: Return database instance
        return dbInstance;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

module.exports = connectToDatabase;