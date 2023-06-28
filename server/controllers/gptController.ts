import { Request, Response } from "express";
import { startChatWithGPT, continueChatWithGPT } from "../utils/gpt.js";

export async function startChat(req: Request, res: Response) {
  try {
    const { symbol } = req.body;

    const message = await startChatWithGPT(symbol);
    console.log(message);
    res.json(message?.content);
  } catch (error) {
    console.log(error);
    res.json({ message: "error", error: (error as Error).message });
  }
}
