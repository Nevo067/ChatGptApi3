import express from 'express';
import * as dotenv from 'dotenv';
import { ChatGPTAPI } from 'chatgpt';
dotenv.config();
const app = express();
app.use(express.json());
const port = 8000;
let idRep;
const api = new ChatGPTAPI({
    //apiKey: "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"
    apiKey: process.env.OPENAI_API_KEY
});
app.get('/', (req, res) => {
    res.send('Application works!');
});
app.get('/test', (req, res) => {
    api.sendMessage("bonjour est ce que tu marche").then((rep) => {
        console.log(rep);
        idRep = rep.parentMessageId;
        res.send(rep.text);
    });
});
app.post('/init', (req, res) => {
    let json = req.body;
    console.log(json.text);
    api.sendMessage(json.text).then((rep) => {
        idRep = rep.parentMessageId;
        console.log(rep.text);
        res.send(rep.text);
    });
});
app.post('/talkto', (req, res) => {
    console.log(idRep);
    let json = req.body;
    console.log(json.text);
    api
        .sendMessage(json.text, {
        parentMessageId: idRep
    })
        .then((rep) => {
        idRep = rep.parentMessageId;
        res.send(rep.text);
    });
});
app.listen(port, () => {
    console.log('Application started on port 3000!');
});
