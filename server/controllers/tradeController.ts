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
import { channel } from "../utils/producer.js";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

// render buy ETH by fiat currency page
export function renderBuyPage(req: Request, res: Response) {
  res.status(200).render("buy");
}

// buy ETH by fiat currency
export async function buyEth(req: RequestWithPayload, res: Response) {
  try {
    const { public_address: userWalletAddress, id: userId } = req.payload;
    const { ethAmount } = req.body;

    const task = { data: { userId, userWalletAddress, ethAmount } };

    channel.sendToQueue("buyEth_Queue", Buffer.from(JSON.stringify(task)));

    res.status(200).json({ txSending: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ txSending: false, error: (error as Error).message });
  }
}

// render swap ETH page
export function renderSwapPage(req: Request, res: Response) {
  res.status(200).render("swap");
}

// swap ETH to ERC20 token
export async function swapEthToErc20(req: RequestWithPayload, res: Response) {
  try {
    const { tokenAddress, tokenAmount, tokenSymbol, tokenCmcId } = req.body;
    const { public_address: userWalletAddress, id: userId } = req.payload;

    const task = {
      data: {
        userId,
        userWalletAddress,
        tokenAddress,
        tokenAmount,
        tokenSymbol,
        tokenCmcId,
      },
    };

    channel.sendToQueue(
      "swapEthToErc20_Queue",
      Buffer.from(JSON.stringify(task))
    );

    res.status(200).json({ txSending: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({ txSending: false, error: (error as Error).message });
  }
}

// swap ERC20 token to ETH
export async function swapErc20ToEth(req: RequestWithPayload, res: Response) {
  try {
    const { tokenAddress, tokenAmount, tokenSymbol, tokenCmcId } = req.body;
    const { public_address: userWalletAddress, id: userId } = req.payload;

    const task = {
      data: {
        userId,
        userWalletAddress,
        tokenAddress,
        tokenAmount,
        tokenSymbol,
        tokenCmcId,
      },
    };

    console.log(task);

    channel.sendToQueue(
      "swapErc20ToEth_Queue",
      Buffer.from(JSON.stringify(task))
    );

    res.status(200).json({ txSending: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({ txSending: false, error: (error as Error).message });
  }
}
