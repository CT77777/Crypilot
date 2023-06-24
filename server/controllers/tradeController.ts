import { Request, Response } from "express";
import { sendETH } from "../models/tradeModel.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

export function renderTradePage(req: Request, res: Response) {
  res.status(200).render("trade");
}

export async function buyETH(req: RequestWithPayload, res: Response) {
  try {
    const { public_address: userWalletAddress } = req.payload;
    const { ethAmount } = req.body;
    const isSent = await sendETH(userWalletAddress as string, ethAmount);
    res.status(200).json({ isSent });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "buy ETH failed", error: (error as Error).message });
  }
}
