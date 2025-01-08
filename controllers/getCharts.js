const express = require('express');
const https = require('https');

require('dotenv').config(); 

const getCharts = async (req, res) => {
    const { region, symbol, interval, range, comparisons } = req.query;

    // Validate required parameters
    if (!region || !symbol || !interval || !range) {
        return res.status(400).json({
            error: 'Missing required query parameters: region, symbol, interval, range',
        });
    }

    // Construct the API request path
    const encodedComparisons = encodeURIComponent(comparisons || '');
    const path = `/market/get-charts?region=${region}&symbol=${symbol}&interval=${interval}&range=${range}&comparisons=${encodedComparisons}`;

    const options = {
        method: 'GET',
        hostname: 'yh-finance.p.rapidapi.com',
        port: null,
        path: path,
        headers: {
            'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
            'x-rapidapi-key': process.env.API_SECRET, // Add your API key in .env
        },
    };

    console.log(`Requesting URL: https://${options.hostname}${options.path}`);

    const request = https.request(options, (response) => {
        const chunks = [];

        response.on('data', (chunk) => {
            chunks.push(chunk);
        });

        response.on('end', () => {
            const body = Buffer.concat(chunks).toString();

            try {
                const jsonResponse = JSON.parse(body);
                res.json(jsonResponse);
            } catch (error) {
                console.error('Failed to parse JSON:', error.message);
                res.status(500).json({ error: 'Invalid JSON response from Yahoo Finance API' });
            }
        });
    });

    request.on('error', (err) => {
        console.error(`Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch chart data' });
    });

    request.end();
};

module.exports = getCharts;
