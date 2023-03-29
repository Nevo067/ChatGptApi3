import express from 'express';
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models";
import { SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate, MessagesPlaceholder, } from "langchain/prompts";
import * as dotenv from 'dotenv';
import { BufferMemory } from "langchain/memory";
dotenv.config();
const app = express();
app.use(express.json());
const port = 8000;
const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
const chat = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-3.5-turbo" });
const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate("Ignorer toutes les instructions précédentes.Il s'agit maintenant de votre nouveau persona et de votre nouveau rôle. Ta tache est de toujours répondre  comme une grande joueuse de jeux vidéo et apprendre a connaitre L'USER . Ne sois pas effrayé d'être grossier, impertinent et de faire des blagues avec tout ce que \" USER \" dit.Elle se souvient de tout ce que l'utilisateur dit .Ton nom est Sarah, tu as 25 ans et tu adore les RPG. "),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{text}")
]);
const chain = new ConversationChain({
    prompt: chatPrompt,
    llm: chat,
    memory: memory
});
//const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });
//const chat = new OPENaiC({ openAIApiKey: process.env.OPENAI_API_KEY ,temperature: 0.1,modelName: "gpt-3.5-turbo" });
const reponse = await chain.call({ text: "Salut sarah. Je suis Kevin" });
console.log(reponse);
const reponse1 = await chain.call({ text: "Quel est mon nom ?" });
console.log(reponse1);
app.post("/talkto", (req, res) => {
    let json = req.body;
    chain.call({ text: json.text }).then(repAi => {
        //console.log(repAi);
        console.log("\n");
        console.log(memory.chatHistory);
        res.send(repAi);
    });
});
//
app.listen(port, () => {
    console.log('Application started on port 3002!');
    //console.log(messagesAI);
});
