import { Request, Response } from "express";
import {
  sendETH,
  swapEthToToken,
  swapTokenToEth,
  getPrivateKey,
  insertInventoryFt,
} from "../models/tradeModel.js";
import { JWTPayload } from "jose";
import { decrypt } from "../utils/createWallet.js";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

export function renderBuyPage(req: Request, res: Response) {
  res.status(200).render("buy");
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

// swap ETH to ERC20 token
export async function swapEthToErc20(req: RequestWithPayload, res: Response) {
  try {
    const { tokenAddress, tokenAmount } = req.body;
    const { public_address: userWalletAddress, id: userId } = req.payload;
    console.log("wallet", userWalletAddress);

    //get encrypted private key from DB
    const { private_key: encryptedPrivateKey } = await getPrivateKey(
      (userWalletAddress as string).slice(2)
    );

    //decrypt
    const private_key = decrypt(encryptedPrivateKey);

    await swapEthToToken(
      tokenAddress,
      tokenAmount,
      private_key,
      userWalletAddress as string
    );
    await insertInventoryFt(tokenAddress.slice(2), userId as number);
    res.status(200).json({ tokenAddress, tokenAmount });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "swap ETH failed", error: (error as Error).message });
  }
}

// swap ERC20 token to ETH
export async function swapErc20ToEth(req: RequestWithPayload, res: Response) {
  try {
    const { tokenAddress, tokenAmount } = req.body;
    const { public_address: userWalletAddress } = req.payload;
    console.log(userWalletAddress);

    //get encrypted private key from DB
    const { private_key: encryptedPrivateKey } = await getPrivateKey(
      (userWalletAddress as string).slice(2)
    );

    //decrypt
    const private_key = decrypt(encryptedPrivateKey);

    await swapTokenToEth(
      tokenAddress,
      tokenAmount,
      private_key,
      userWalletAddress as string
    );
    res.status(200).json({ tokenAddress, tokenAmount });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "swap ETH failed", error: (error as Error).message });
  }
}
