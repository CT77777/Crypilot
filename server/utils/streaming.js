import { Configuration, OpenAIApi } from "openai";
import { Readable } from "readable-stream";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function streamingChatCompletion() {
  console.time("chatCompletion");
  const chatCompletion = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        { role: "system", content: "You are a blockchain and crypto expert." },
        {
          role: "user",
          content: `Give me simple information about USDT in blockchain, only one sentence.`,
        },
      ],
    },
    { responseType: "stream" }
  );

  const reader = Readable.from(chatCompletion.data);
  const decoder = new TextDecoder("utf-8");

  reader.on("readable", () => {
    let chunk;
    while (null !== (chunk = reader.read())) {
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
        const { delta } = choices[0];
        const { content } = delta;
        if (content) {
          console.log(content);
        }
      });
    }
  });
  console.timeEnd("chatCompletion");

  //   const { message } = chatCompletion.data.choices[0];
  //   return message;
}

streamingChatCompletion();
