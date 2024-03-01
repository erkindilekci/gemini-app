import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PORT = 8000;
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/gemini', async (req, res) => {
    console.log(req.body.history);
    console.log(req.body.message);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const chat = model.startChat({history: req.body.history})
    const message = req.body.message;

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    res.send(text);
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
