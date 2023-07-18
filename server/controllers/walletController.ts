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
export function renderWalletPage(req: RequestWithPayload, res: Response) {
  const { name, picture, public_address } = req.payload;

  const data = {
    title: `Wallet`,
    name: name,
    picture: picture,
    public_address: public_address,
  };

  res.status(200).render("wallet", data);
}

// get ETH balance of user's wallet
export async function getWalletETH(req: RequestWithPayload, res: Response) {
  const { public_address: userWalletAddress } = req.payload;
  const userEthBalance = await getUserEthBalance(userWalletAddress as string);

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

  res.status(200).json({ userFtsBalance });
}
