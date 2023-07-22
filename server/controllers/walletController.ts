import { Request, Response } from "express";
import {
  getUserEthBalance,
  getUserFts,
  getUserFtsBalance,
} from "../models/walletModel.js";

// render wallet page
export function renderWalletPage(req: Request, res: Response) {
  const { name, picture, public_address } = res.locals.payload;

  const data = {
    title: `Wallet`,
    name: name,
    picture: picture,
    public_address: public_address,
  };

  res.status(200).render("wallet", data);
}

// get ETH balance of user's wallet
export async function getWalletETH(req: Request, res: Response) {
  const { public_address: userWalletAddress } = res.locals.payload;
  const userEthBalance = await getUserEthBalance(userWalletAddress as string);

  res.status(200).json({ userEthBalance });
}

// get FTs of user's wallet
export async function getWalletFts(req: Request, res: Response) {
  const { public_address: userWalletAddress, id: userId } = res.locals.payload;
  const userFts = await getUserFts(userId as number);
  const userFtsBalance = await getUserFtsBalance(
    userWalletAddress as string,
    userFts
  );

  res.status(200).json({ userFtsBalance });
}
