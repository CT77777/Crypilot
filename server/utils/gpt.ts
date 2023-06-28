import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function startChatWithGPT(symbol: string) {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a blockchain and crypto expert." },
      {
        role: "user",
        content: `Give me simple information about ${symbol} in blockchain, only one sentence.`,
      },
    ],
  });
  const { message } = chatCompletion.data.choices[0];
  return message;
}

export async function continueChatWithGPT(
  messages: ChatCompletionRequestMessage[]
) {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  const { message } = chatCompletion.data.choices[0];
  console.log(message);
  return message;
}
