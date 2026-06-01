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
        // Task 4: Extract the sentence parameter from the request body
        const { sentence } = req.body;

        if (!sentence) {
            console.error('No sentence provided in the request body');
            return res.status(400).json({ error: 'No sentence provided' });
        }

        // Initialize Natural Sentiment Analyzer tools
        const Analyzer = natural.SentimentAnalyzer;
        const stemmer = natural.PorterStemmer;
        const analyzer = new Analyzer("English", stemmer, "afinn");

        // Tokenize the text into an array of words for analysis
        const tokenizer = new natural.WordTokenizer();
        const tokenizedSentence = tokenizer.tokenize(sentence);

        // Fetch the numerical sentiment score from natural analyzer
        const score = analyzer.getSentiment(tokenizedSentence);

        // Task 5: Process response from Natural to find sentiment labels
        let sentiment = 'neutral';
        if (score < 0) {
            sentiment = 'negative';
        } else if (score > 0.33) {
            sentiment = 'positive';
        } else {
            sentiment = 'neutral';
        }

        // Task 6: Implement success return state
        console.log(`Sentiment analysis successful. Score: ${score}, Label: ${sentiment}`);
        res.status(200).json({ sentiment: sentiment, score: score });

    } catch (error) {
        // Task 7: Implement error return state
        console.error(`Error performing sentiment analysis: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error during analysis' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});