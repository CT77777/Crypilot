import { Request, Response } from "express";
import { startChatWithGPT, continueChatWithGPT } from "../utils/gpt.js";

export async function startChat(req: Request, res: Response) {
  const { id: user_id } = res.locals.payload;
  const { symbol } = req.body;

  try {
    const message = await startChatWithGPT(symbol, user_id as number);

    res.status(200).json({ message });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ error: { message: "start chatting with GPT failed" } });
  }
}

export async function continueChat(req: Request, res: Response) {
  const { id: user_id } = res.locals.payload;
  const { inputText } = req.body;

  try {
    const inputMessage = {
      role: "user",
      content: inputText,
    };
    const message = await continueChatWithGPT(inputMessage, user_id as number);

    res.status(200).json({ message });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ error: { message: "continue chatting with GPT failed" } });
  }
}
