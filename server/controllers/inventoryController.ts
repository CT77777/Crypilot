import { Request, Response } from "express";
import {
  getUserEthBalance,
  getUserFts,
  getUserFtsBalance,
} from "../models/inventoryModel.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

export function renderInventoryPage(req: Request, res: Response) {
  res.status(200).render("wallet");
}

export async function getInventoryFts(req: RequestWithPayload, res: Response) {
  const { public_address: userWalletAddress, id: userId } = req.payload;
  const userFts = await getUserFts(userId as number);
  const userFtsBalance = await getUserFtsBalance(
    userWalletAddress as string,
    userFts
  );
  console.log(userFtsBalance);

  res.status(200).json({ userFtsBalance });
}
