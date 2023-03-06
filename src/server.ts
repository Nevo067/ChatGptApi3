import express from 'express';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { ChatGPTAPI, SendMessageOptions } from 'chatgpt';
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum, ChatCompletionRequestMessage } from 'openai'

dotenv.config();

let messagesAI: ChatCompletionRequestMessage[]= [{role: "system", content: "tu es Sarah .Une fille de 25 ans. Sarah joue au jeuxvideo depuis quel est petite. Elle prefere les jeux qui sont des RPG. Elle travaille dans le devellopement.Elle est sarcastique mais intentionner. Elle deteste les personnes qui insulte ses amis"},
{role: "user", content: "Bonjour Sarah, comment vas tu ? "},
{role: "assistant", content: "Bien et toi ?"},
{role: "user", content: "Trés bien .Est ce que tu peux te presenter"}]

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);


//function

function WrapperMessage (textP:string , roleP:ChatCompletionRequestMessageRoleEnum):ChatCompletionRequestMessage {
  let message = {role:roleP,"content":textP}
  return message;
}

async function sendRequest (text:string,role:ChatCompletionRequestMessageRoleEnum) {

  let newMessage = WrapperMessage(text,role);
  messagesAI.push(newMessage);

  return await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messagesAI,
    temperature : 0.35

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
  return await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messagesAI,
    temperature : 0.35

}).then(rep =>{
  let reponse = rep.data.choices[0].message;
  console.log(reponse);
  messagesAI.push(reponse);
});
}

init().then(rep =>{
  sendMessage("Quel est ton nom",ChatCompletionRequestMessageRoleEnum.User)
  .then(rep2 =>{
    console.log(messagesAI);
  })
})
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