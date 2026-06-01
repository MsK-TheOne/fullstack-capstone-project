const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // Connect directly to the database instance
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        let query = {};

        // Add filters
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" };
        }
        if (req.query.category && req.query.category.trim() !== '') {
            query.category = req.query.category;
        }
        if (req.query.condition && req.query.condition.trim() !== '') {
            query.condition = req.query.condition;
        }
        if (req.query.age_years && req.query.age_years.trim() !== '') {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        // Task 4: Fetch filtered gifts
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;