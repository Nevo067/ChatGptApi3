import express from 'express';
import * as dotenv from 'dotenv';
import { ChatGPTAPI } from 'chatgpt';
import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello world" }],
});
console.log(completion.data.choices[0].message);
dotenv.config();
const app = express();
app.use(express.json());
const port = 8000;
let idRep;
let messages = { "role": "assistant", "content": "Tu es Sarah .Une fille de 25 ans. Sarah joue au jeuxvideo depuis quel est petite. Elle prefere les jeux qui sont des RPG. Elle travaille dans le devellopement.Elle est sarcastique mais intentionner. Elle deteste les personnes qui insulte ses amis" };
const api = new ChatGPTAPI({
    //apiKey: "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"
    apiKey: process.env.OPENAI_API_KEY,
});
//Wrapper Message
function WrapperMessage(text) {
    let message = [{ "role": "user", "content": text }];
    return message;
}
//Request
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
app.post('/initP', (req, res) => {
    let json = req.body;
    console.log(json.text);
    api.sendMessage("messages").then((rep) => {
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
