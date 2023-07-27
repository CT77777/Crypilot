const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function main() {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a blockchain expert." },
      { role: "user", content: "What is ETH in Ethereum?" },
    ],
  });
  console.log(chatCompletion.data.choices[0].message);
}

main();
