import { Request, Response } from "express";
import {
  getUserEthBalance,
  getUserFts,
  getUserFtsBalance,
} from "../models/walletModel.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

// render wallet page
export function renderWalletPage(req: Request, res: Response) {
  res.status(200).render("wallet");
}

// get ETH balance of user's wallet
export async function getWalletETH(req: RequestWithPayload, res: Response) {
  const { public_address: userWalletAddress } = req.payload;
  const userEthBalance = await getUserEthBalance(userWalletAddress as string);
  console.log(userEthBalance);

  res.status(200).json({ userEthBalance });
}

// get FTs of user's wallet
export async function getWalletFts(req: RequestWithPayload, res: Response) {
  const { public_address: userWalletAddress, id: userId } = req.payload;
  const userFts = await getUserFts(userId as number);
  const userFtsBalance = await getUserFtsBalance(
    userWalletAddress as string,
    userFts
  );
  console.log(userFtsBalance);

  res.status(200).json({ userFtsBalance });
}
