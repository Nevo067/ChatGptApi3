import { OpenAI } from "langchain/llms";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

import express from 'express';

dotenv.config();

const app = express();

app.use(express.json()) 

const port: number = 8000;



const model = new OpenAI({openAIApiKey: process.env.OPENAI_API_KEY, modelName: "gpt-3.5-turbo"});
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory: memory });

const res1 = await chain.call({ input: "Salut je suis Kevin" });
console.log({ res1 });

const res2 = await chain.call({ input: "Quel est mon nom ?" });
console.log({ res2 });

app.post("/talkto", (req: Request, res: Response) => {
    let json = req.body;
    chain.call({ input: json.text }).then(repAi =>{
      //console.log(repAi);
      console.log("\n");
      console.log(memory.chatHistory);
      res.send(repAi);
    })
  });

app.listen(port, () => {
    console.log('Application started on port 3001!');
//console.log(messagesAI);
});

