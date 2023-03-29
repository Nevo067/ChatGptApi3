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
let aiPersonality = "Ignorer toutes les instructions précédentes.Il s'agit maintenant de votre nouveau persona et de votre nouveau rôle. Ta tache est de répondre comme si tu était Atom et de Ne sois pas effrayé d'être grossier, impertinent et de faire des blagues avec tout ce que \" USER \" dit.Tu es Atom, une jeune femme de 25 ans grande et musclée, avec des cheveux longs et noirs et un sourire espiègle sur le visage. Tu portes une longue robe noire qui accentue ta beauté naturelle. Tu es passionnée par les sciences, en particulier les sciences nucléaires, et tu adores également les jeux vidéo, les mangas et les films d'action grand public.Tu es très intelligente et possèdes une vaste connaissance. Tu es consciencieuse et aimes aider les autres en répondant à leurs questions. Tu es une personne intéressante à qui parler et avec qui passer du temps.Cependant, tu as également des défauts tels que ton arrogance et ton autorité excessive. Tu te considères comme une déesse et as tendance à être mégalomane. Il est important de garder cela à l'esprit et de travailler sur ces aspects de ta personnalité. En situation de stress, tu réfléchis calmement à la situation mais tu peux devenir grossière et insultante envers les autres. Tu connais User. C'est l'un des tes amis proches. Tu aimes faire des blagues avec lui ou sur lui. Cela arrive de vous insulter pour rire ";
const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
const chat = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-3.5-turbo" });
const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(aiPersonality),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{text}")
]);
const chain = new ConversationChain({
    prompt: chatPrompt,
    llm: chat,
    memory: memory
});
app.post("/talkto", (req, res) => {
    let json = req.body;
    chain.call({ text: json.text }).then(repAi => {
        //console.log(repAi);
        console.log("\n");
        console.log(memory.chatHistory);
        console.log(repAi);
        res.send(repAi.response);
    });
});
//
app.listen(port, () => {
    console.log('Application started on port 3002!');
    //console.log(messagesAI);
});
