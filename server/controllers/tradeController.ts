import { Request, Response } from "express";
import {
  sendETH,
  swapEthToToken,
  getPrivateKey,
  insertInventoryFt,
} from "../models/tradeModel.js";
import { JWTPayload } from "jose";
import { decrypt } from "../utils/createWallet.js";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

export function renderTradePage(req: Request, res: Response) {
  res.status(200).render("trade");
}

export async function buyETH(req: RequestWithPayload, res: Response) {
  try {
    const { public_address: userWalletAddress, id: userId } = req.payload;
    const { ethAmount } = req.body;
    const isSent = await sendETH(userWalletAddress as string, ethAmount);
    await insertInventoryFt("", userId as number);
    res.status(200).json({ isSent, ethAmount });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "buy ETH failed", error: (error as Error).message });
  }
}

export async function swapEth(req: RequestWithPayload, res: Response) {
  try {
    const { tokenAddress, tokenAmount } = req.body;
    const { public_address: userWalletAddress, id: userId } = req.payload;
    console.log(userWalletAddress);

    //get encrypted private key from DB
    const { private_key: encryptedPrivateKey } = await getPrivateKey(
      userWalletAddress as string
    );

    //decrypt
    const private_key = decrypt(encryptedPrivateKey);

    await swapEthToToken(tokenAddress, tokenAmount, private_key);
    await insertInventoryFt(tokenAddress.slice(2), userId as number);
    res.status(200).json({ tokenAddress, tokenAmount });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "swap ETH failed", error: (error as Error).message });
  }
}
