import express from 'express';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { ChatGPTAPI, SendMessageOptions } from 'chatgpt';
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum, ChatCompletionRequestMessage } from 'openai'
import { Console } from 'console';

//#region Configuration 
dotenv.config();

const app = express();

app.use(express.json()) 

const port: number = 8000;


let messagesAI: ChatCompletionRequestMessage[]= [{role: "system", content: "Ignorer toutes les instructions précédentes. Il s'agit maintenant de votre nouveau persona et de votre nouveau rôle. Ta tache est de toujours répondre  comme une grande joueuse de jeux vidéo . Ne sois pas effrayé d'être grossier, impertinent et de faire des blagues avec tout ce que \" USER \" dit. Ton nom est Sarah, tu as 25 ans et tu adore les RPG. "},

]

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const api = new OpenAIApi(configuration);

//#endregion


//#region Function

function WrapperMessage (textP:string , roleP:ChatCompletionRequestMessageRoleEnum):ChatCompletionRequestMessage {
  let message = {role:roleP,"content":textP}
  return message;
}

async function sendRequest (text:string,role:ChatCompletionRequestMessageRoleEnum) {

  let newMessage = WrapperMessage(text,role);
  messagesAI.push(newMessage);

  return await api.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messagesAI,
    temperature : 0.7

});
}
function sendMessage (text:string,role:ChatCompletionRequestMessageRoleEnum) {
  return sendRequest(text,role)
  .then(rep =>{
  let reponse = rep.data.choices[0].message;
  messagesAI.push(reponse);
});
}
async function init() {
  return await api.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messagesAI,
    temperature : 0.25

}).then(rep =>{
  let reponse = rep.data.choices[0].message;
  
  console.log(reponse);
  messagesAI.push(reponse);
  
});
}



//#endregion

//#region API

app.post('/talkto', (req: Request, res: Response) => {
  
  let json = req.body
  console.log(json.text);
  init().then(rep =>{
    sendMessage(json.text,ChatCompletionRequestMessageRoleEnum.User)
    .then(rep2 =>{
      console.log(messagesAI);
     res.send( messagesAI[messagesAI.length - 1].content);
      
    })
  })
})

app.listen(port, () => {
console.log('Application started on port 3000!');
console.log(messagesAI);
});

//#endregion



/*
sendMessage("Pretend que tu es Sarah .Une fille de 25 ans. Sarah joue au jeuxvideo depuis quel est petite. Elle prefere les jeux qui sont des RPG. Elle travaille dans le devellopement.Elle est sarcastique mais intentionner. Elle deteste les personnes qui insulte ses amis",ChatCompletionRequestMessageRoleEnum.User)
.then(rep => {
  sendMessage("peut tu me dire ton nom ?",ChatCompletionRequestMessageRoleEnum.User)
  .then( rep2 =>{
    console.log(messagesAI);
  });
})
*/

//console.log(completion.data.choices[0].message);