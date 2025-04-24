// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {Filter }from 'bad-words';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const filter = new Filter();

app.post('/api/checkProfanity', (req, res) => {
    const { text } = req.body;
    const hasProfanity = filter.isProfane(text);
    res.json({ hasProfanity });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
