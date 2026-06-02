const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const jwt = require('jsonwebtoken');
const pino = require('pino');

const logger = pino();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_lab_validation";

// 1. Registration Endpoint
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Check if user already exists
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            logger.error("User already exists");
            return res.status(400).json({ error: "Email already registered" });
        }

        // Insert new user
        const newUser = await collection.insertOne({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // Note: In a production app, always hash passwords using bcrypt!
            createdAt: new Date(),
        });

        // Generate authentication token
        const payload = { user: { id: newUser.insertedId } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info("User successfully registered");
        res.status(201).json({ authtoken, email: req.body.email });
    } catch (e) {
        logger.error(e.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// 2. Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Find user by email
        const user = await collection.findOne({ email: req.body.email });
        if (!user || user.password !== req.body.password) {
            logger.error("Invalid credentials matching failed");
            return res.status(400).json({ error: "Invalid Email or Password" });
        }

        // Generate token on successful validation
        const payload = { user: { id: user._id } };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info("User successfully logged in");
        res.status(200).json({ authtoken, email: user.email });
    } catch (e) {
        logger.error(e.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// 3. Update User Information Endpoint
router.put('/update', async (req, res) => {
    try {
        const email = req.headers.email; // Read user context from request headers
        if (!email) {
            return res.status(400).json({ error: "Email header missing" });
        }

        const db = await connectToDatabase();
        const collection = db.collection("users");

        const updateResult = await collection.updateOne(
            { email: email },
            { $set: { name: req.body.name } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ error: "No changes made or user not found" });
        }

        logger.info("User information updated successfully");
        res.status(200).json({ message: "User information updated successfully" });
    } catch (e) {
        logger.error(e.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;