import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import dotenv from "dotenv";
import { socket } from "../app.js";
import { redisClient } from "./cache.js";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function startChatWithGPT(symbol: string, user_id: number) {
  try {
    const requestMessages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: "You are a blockchain and crypto expert.",
      },
      {
        role: "user",
        content: `Give me simple information about ${symbol} in blockchain, only one sentences.`,
      },
    ];

    const completedMessage = { role: "assistant", content: "" };

    const chatCompletion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: requestMessages,
        stream: true,
      },
      { responseType: "stream" }
    );

    const decoder = new TextDecoder("utf-8");

    await new Promise((resolve, reject) => {
      (chatCompletion.data as any).on("data", (data: any) => {
        try {
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
            try {
              const { choices } = element;
              const { delta } = choices[0];
              const { content } = delta;
              if (content) {
                completedMessage.content += content;
                socket.emit("streaming", content, user_id);
              }
            } catch (error) {
              console.log(error);
            }
          });
        } catch (error) {
          console.log(error);
        }
      });

      (chatCompletion.data as any).on("end", resolve);
      (chatCompletion.data as any).on("error", reject);
    });

    const cacheMessages = [...requestMessages, completedMessage];

    await redisClient.set(`${user_id}`, JSON.stringify(cacheMessages));

    return "Chat completed";
  } catch (error) {
    throw new Error("fetch open AI failed");
  }
}

export async function continueChatWithGPT(
  inputMessage: object,
  user_id: number
) {
  try {
    const preCacheMessagesFromRedis = await redisClient.get(`${user_id}`);
    const preCacheMessages = JSON.parse(preCacheMessagesFromRedis || "0");

    const requestMessages = [...preCacheMessages, inputMessage];

    const completedMessage = { role: "assistant", content: "" };

    const chatCompletion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: requestMessages,
        stream: true,
      },
      { responseType: "stream" }
    );

    const decoder = new TextDecoder("utf-8");

    await new Promise((resolve, reject) => {
      (chatCompletion.data as any).on("data", (data: any) => {
        try {
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
            try {
              const { choices } = element;
              if (choices === undefined) {
                throw new Error("resolve streaming data failed");
              }
              const { delta } = choices[0];
              const { content } = delta;
              if (content) {
                completedMessage.content += content;
                socket.emit("streamingContinue", content, user_id);
              }
            } catch (error) {
              console.log(error);
            }
          });
        } catch (error) {
          console.log(error);
        }
      });

      (chatCompletion.data as any).on("end", resolve);
      (chatCompletion.data as any).on("error", reject);
    });

    const cacheMessages = [...requestMessages, completedMessage];

    await redisClient.set(`${user_id}`, JSON.stringify(cacheMessages));

    return "Chat completion";
  } catch (error) {
    throw new Error("fetch open AI failed");
  }
}
