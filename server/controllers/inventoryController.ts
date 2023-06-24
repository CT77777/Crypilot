import { Request, Response } from "express";
import { getEthBalance } from "../models/inventoryModel.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

export function renderInventoryPage(req: Request, res: Response) {
  res.status(200).render("inventory");
}

export async function getEHTBalance(req: RequestWithPayload, res: Response) {
  const { public_address: userWalletAddress } = req.payload;
  const ethBalance = await getEthBalance(userWalletAddress as string);
  res.status(200).json({ ethBalance });
}
