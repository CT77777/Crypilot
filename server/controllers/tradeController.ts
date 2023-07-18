import { Request, Response } from "express";
import {
  selectSwapTokens,
  quoteExactInputSwapToken,
  quoteExactOutputSwapToken,
} from "../models/tradeModel.js";
import { JWTPayload } from "jose";
import { channel } from "../utils/producer.js";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

// render buy ETH by fiat currency page
export function renderBuyPage(req: RequestWithPayload, res: Response) {
  const { name, picture, public_address } = req.payload;

  const data = {
    title: `Buy`,
    name: name,
    picture: picture,
    public_address: public_address,
  };

  res.status(200).render("buy", data);
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
export function renderSwapPage(req: RequestWithPayload, res: Response) {
  const { name, picture, public_address } = req.payload;

  const data = {
    title: `Swap`,
    name: name,
    picture: picture,
    public_address: public_address,
  };

  res.status(200).render("swap", data);
}

// get swap tokens
export async function getSwapTokens(req: Request, res: Response) {
  try {
    const ft_cmc_ids = [3717, 4943, 825, 3408, 8104, 7278, 5692, 7083, 6758];
    const swapTokens = await selectSwapTokens(ft_cmc_ids);

    res.status(200).json({ data: swapTokens });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: { message: "Something wrong at server side" } });
  }
}

// swap ETH to ERC20 token
export async function swapEthToErc20(req: RequestWithPayload, res: Response) {
  try {
    const { tokenAddress, tokenAmount, tokenSymbol, tokenCmcId } = req.body;
    const { public_address: userWalletAddress, id: userId } = req.payload;

    console.log(req.body);

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

    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ txSending: false, error: (error as Error).message });

    return;
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

// get quote of exact input swap token
export async function quoteExactInput(req: Request, res: Response) {
  try {
    const { tokenIn, tokenInSymbol, amountIn, tokenOut, tokenOutSymbol } =
      req.body;

    let decimalIn = 18;
    let decimalOut = 18;
    if (tokenInSymbol === "USDC" || tokenInSymbol === "USDT") {
      decimalIn = 6;
    }
    if (tokenOutSymbol === "USDC" || tokenOutSymbol === "USDT") {
      decimalOut = 6;
    }

    const { amountOut, estimateGasFee } = await quoteExactInputSwapToken(
      tokenIn,
      tokenOut,
      amountIn,
      decimalIn,
      decimalOut
    );

    res.status(200).json({
      data: {
        amountOut,
        estimateGasFee,
      },
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ error: { message: "Something wrong at server side" } });
  }
}

// get quote of exact output swap token
export async function quoteExactOutput(req: Request, res: Response) {
  try {
    const { tokenIn, tokenInSymbol, tokenOut, tokenOutSymbol, amountOut } =
      req.body;

    let decimalIn = 18;
    let decimalOut = 18;
    if (tokenInSymbol === "USDC" || tokenInSymbol === "USDT") {
      decimalIn = 6;
    }
    if (tokenOutSymbol === "USDC" || tokenOutSymbol === "USDT") {
      decimalOut = 6;
    }

    const { amountIn, estimateGasFee } = await quoteExactOutputSwapToken(
      tokenIn,
      tokenOut,
      amountOut,
      decimalIn,
      decimalOut
    );

    res.status(200).json({
      data: {
        amountIn,
        estimateGasFee,
      },
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ error: { message: "Something wrong at server side" } });
  }
}
