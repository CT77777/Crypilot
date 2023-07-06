import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import dotenv from "dotenv";
import { socket } from "../app.js";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function startChatWithGPT(symbol: string) {
  try {
    console.time("chat completion time");
    const chatCompletion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a blockchain and crypto expert.",
          },
          {
            role: "user",
            content: `Give me simple information about ${symbol} in blockchain, only three sentences.`,
          },
        ],
        stream: true,
      },
      { responseType: "stream" }
    );

    const decoder = new TextDecoder("utf-8");

    await new Promise((resolve, reject) => {
      (chatCompletion.data as any).on("data", (data: any) => {
        const chunk = data;
        const decodedChunk = decoder.decode(chunk);
        const lines = decodedChunk.split("\n");
        const parsedLines = lines
          .map((line) => {
            return line.replace(/^data: /, "").trim();
          })
          .filter((line) => {
            return line !== "" && line !== "[DONE]";
          })
          .map((line) => {
            return JSON.parse(line);
          });

        parsedLines.forEach((element) => {
          const { choices } = element;
          if (choices === undefined) {
            throw new Error("resolve streaming data failed");
          }
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            console.log(content);
            socket.emit("streaming", content);
          }
        });
      });

      (chatCompletion.data as any).on("end", resolve);
    });
    console.timeEnd("chat completion time");

    return "Chat completion";
  } catch (error) {
    console.log(error);
    throw new Error("fetch open AI failed");
  }
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
