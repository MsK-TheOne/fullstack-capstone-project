/*jshint esversion: 8 */
const express = require('express');

// Task 1: Import the Natural library
const natural = require('natural');

// Task 2: Initialize the Express server
const app = express();
const port = process.env.PORT || 2000;

app.use(express.json());

// Task 3: Create a POST /sentiment endpoint
app.post('/sentiment', async (req, res) => {
    try {
        // Task 4: Extract the sentence parameter from req.query using destructuring
        const { sentence } = req.query;

        if (!sentence) {
            console.error('No sentence provided in the query parameters');
            return res.status(400).json({ error: 'No sentence provided' });
        }

        // Initialize Natural Sentiment Analyzer tools
        const Analyzer = natural.SentimentAnalyzer;
        const stemmer = natural.PorterStemmer;
        const analyzer = new Analyzer("English", stemmer, "afinn");

        // Tokenize the text into an array of words
        const tokenizer = new natural.WordTokenizer();
        const tokenizedSentence = tokenizer.tokenize(sentence);

        // Fetch the numerical sentiment score
        const analysisResult = analyzer.getSentiment(tokenizedSentence);

        // Task 5: Process response using if/else loops
        let sentiment = 'neutral';
        if (analysisResult < 0) {
            sentiment = 'negative';
        } else if (analysisResult > 0.33) {
            sentiment = 'positive';
        } else {
            sentiment = 'neutral';
        }

        // Task 6: Implement success return state matching exact hint schema
        console.log(`Sentiment analysis successful. Score: ${analysisResult}, Label: ${sentiment}`);
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });

    } catch (error) {
        // Task 7: Implement error return state using 500 status and json()
        console.error(`Error performing sentiment analysis: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error during analysis' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});