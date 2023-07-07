import { Request, Response } from "express";
import { startChatWithGPT, continueChatWithGPT } from "../utils/gpt.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

export async function startChat(req: RequestWithPayload, res: Response) {
  try {
    const { id: user_id } = req.payload;
    const { symbol } = req.body;

    const message = await startChatWithGPT(symbol, user_id as number);

    res.json({ message });
  } catch (error) {
    console.log(error);
    res.json({ message: "error", error: (error as Error).message });
  }
}

export async function continueChat(req: RequestWithPayload, res: Response) {
  try {
    const { id: user_id } = req.payload;

    const { inputText } = req.body;
    const inputMessage = {
      role: "user",
      content: inputText,
    };
    const message = await continueChatWithGPT(inputMessage, user_id as number);

    res.json({ message });
  } catch (error) {
    console.log(error);
    res.json({ message: "error", error: (error as Error).message });
  }
}
