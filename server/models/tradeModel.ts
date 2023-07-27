import { ethers } from "ethers";
import dbPool from "./dbPool.js";
import { RowDataPacket, FieldPacket } from "mysql2";
import dotenv from "dotenv";
import {
  RPC_URL,
  token_address,
  uniswap_address,
  contract_ABI,
  QuoterV2,
} from "../config/config.js";
dotenv.config();

const treasuryPrivateKey = process.env.TREASURY_PRIVATE_KEY || "0x0";
const treasuryProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
const treasuryWallet = new ethers.Wallet(treasuryPrivateKey, treasuryProvider);

const WETH_ADDRESS = token_address.WETH;
const SimpSwapAddress = process.env.SIMPLE_SWAP_ADDRESS;
const QuoterV2Address = uniswap_address.QuoterV2;
const feeTier = 3000;

const erc20Abi = contract_ABI.ERC20;

const simpleSwapAbi = contract_ABI.simple_swap;

// send ETH to user from treasury wallet
export async function sendETH(user_wallet_address: string, eth_amount: string) {
  const transaction = {
    to: user_wallet_address,
    value: ethers.utils.parseEther(eth_amount),
  };

  try {
    const txResponse = await treasuryWallet.sendTransaction(transaction);

    //wait() is for checking whether tx is mined in blockchain
    const receipt = await txResponse.wait();

    if (receipt.status === 0x1) {
      console.log(`tx success`);
      return true;
    } else {
      console.log(`tx failed`);
      return false;
    }
  } catch (error) {
    console.log(error);

    return false;
  }
}

// swap ETH to get exact FT(ERC20) amount
export async function swapEthToToken(
  token_address: string,
  token_amount: string,
  user_private_key: string,
  user_public_address: string
) {
  const userPrivateKey = user_private_key;
  const userProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const userWallet = new ethers.Wallet(userPrivateKey, userProvider);

  const weth = new ethers.Contract(WETH_ADDRESS, erc20Abi, userWallet);

  try {
    const ethBalanceWei = await userProvider.getBalance(user_public_address);
    const ethBalanceEther = ethers.utils.formatUnits(ethBalanceWei, 18);

    const depositValue = parseFloat(ethBalanceEther) - 1;

    // switch ETH to WETH
    const deposit = await weth.deposit({
      value: ethers.utils.parseEther(`${depositValue}`),
    });
    await deposit.wait();

    // approve SimpleSwap contract to transfer user's WETH
    const approve = await weth.approve(
      SimpSwapAddress,
      ethers.utils.parseEther(`${depositValue}`)
    );
    await approve.wait();

    const simpleSwap = new ethers.Contract(
      SimpSwapAddress as string,
      simpleSwapAbi,
      userWallet
    );

    const amountOut = ethers.utils.parseEther(token_amount);
    const amountInMaximum = ethers.utils.parseEther(`${depositValue}`);
    const swap = await simpleSwap.swapExactOutputSingle(
      token_address,
      amountOut,
      amountInMaximum,
      feeTier
    );
    const receipt = await swap.wait();

    const wethBalance = await weth.balanceOf(user_public_address);
    if (wethBalance > 0) {
      const withdraw = await weth.withdraw(wethBalance);
      await withdraw.wait();
    }

    if (receipt.status === 0x1) {
      console.log(`tx success`);
      return true;
    } else {
      console.log(`tx failed`);
      return false;
    }
  } catch (error) {
    const wethBalance = await weth.balanceOf(user_public_address);
    if (wethBalance > 0) {
      const withdraw = await weth.withdraw(wethBalance);
      await withdraw.wait();
    }

    console.log(error);
    return false;
  }
}

// swap exact ERC20 token amount to ETH
export async function swapTokenToEth(
  token_address: string,
  token_amount: string,
  user_private_key: string,
  user_public_address: string
) {
  const userPrivateKey = user_private_key;
  const userProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const userWallet = new ethers.Wallet(userPrivateKey, userProvider);

  const weth = new ethers.Contract(WETH_ADDRESS, erc20Abi, userWallet);

  try {
    // approve SimpleSwap contract to transfer user's ERC20 token
    const er20 = new ethers.Contract(token_address, erc20Abi, userWallet);
    const approve = await er20.approve(
      SimpSwapAddress,
      ethers.utils.parseEther(token_amount)
    );
    await approve.wait();

    const simpleSwap = new ethers.Contract(
      SimpSwapAddress as string,
      simpleSwapAbi,
      userWallet
    );

    const amountIn = ethers.utils.parseEther(token_amount);
    const swap = await simpleSwap.swapExactInputSingle(
      token_address,
      amountIn,
      feeTier
    );
    const receipt = await swap.wait();

    const wethBalance = await weth.balanceOf(user_public_address);
    if (wethBalance > 0) {
      const withdraw = await weth.withdraw(wethBalance);
      await withdraw.wait();
    }

    if (receipt.status === 0x1) {
      console.log(`tx success`);
      return true;
    } else {
      console.log(`tx failed`);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

// get user private key
export async function getPrivateKey(public_address: string) {
  const results: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `
    SELECT private_key FROM user_wallets WHERE public_address = ?
  `,
    [public_address]
  );

  return results[0][0];
}

// insert user's swapping FT(ERC20)
export async function insertInventoryFt(
  contract_address: string,
  user_id: number
) {
  const cmcIdResults: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `
    SELECT cmc_id FROM fts WHERE contract_address = ?
  `,
    [contract_address]
  );

  const { cmc_id: ft_cmc_id } = cmcIdResults[0][0];

  const inventoryResults: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `
    SELECT EXISTS (SELECT 1 FROM user_inventory_fts WHERE user_id = ? && ft_cmc_id = ?) AS isInventoryExist
  `,
    [user_id, ft_cmc_id]
  );

  const { isInventoryExist } = inventoryResults[0][0];

  if (isInventoryExist === 0) {
    await dbPool.query(
      `
      INSERT INTO user_inventory_fts (user_id, ft_cmc_id)
      VALUES (?, ?)
    `,
      [user_id, ft_cmc_id]
    );
  }
}

// get swap tokens
export async function selectSwapTokens(cmc_ids: number[]) {
  const swapTokens: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `
    SELECT name, symbol, contract_address, cmc_id, logo FROM fts 
    WHERE cmc_id IN (?)
  `,
    [cmc_ids]
  );

  return swapTokens[0];
}

// get quote of exact input swap token
export async function quoteExactInputSwapToken(
  token_in: string,
  token_out: string,
  amount_token_in: string,
  decimal_in: number,
  decimal_out: number
) {
  const gasPrice = await treasuryProvider.getGasPrice();
  const gasPriceEth = ethers.utils.formatUnits(gasPrice, 18);

  const IQuoterV2 = new ethers.Contract(
    QuoterV2Address,
    QuoterV2.abi,
    treasuryProvider
  );

  const amountIn = ethers.utils.parseUnits(amount_token_in, decimal_in);

  const params = {
    tokenIn: token_in,
    tokenOut: token_out,
    fee: feeTier,
    amountIn: amountIn,
    sqrtPriceLimitX96: 0,
  };

  const results = await IQuoterV2.callStatic.quoteExactInputSingle(params);
  const amountOut = ethers.utils.formatUnits(results[0], decimal_out);
  const estimateGas = ethers.utils.formatUnits(results[3], 0);
  const estimateGasFee = parseFloat(estimateGas) * parseFloat(gasPriceEth);

  return { amountOut, estimateGasFee };
}

// get quote of exact output swap token
export async function quoteExactOutputSwapToken(
  token_in: string,
  token_out: string,
  amount_token_out: string,
  decimal_in: number,
  decimal_out: number
) {
  const gasPrice = await treasuryProvider.getGasPrice();
  const gasPriceEth = ethers.utils.formatUnits(gasPrice, 18);

  const IQuoterV2 = new ethers.Contract(
    QuoterV2Address,
    QuoterV2.abi,
    treasuryProvider
  );

  const amountOut = ethers.utils.parseUnits(amount_token_out, decimal_out);

  const params = {
    tokenIn: token_in,
    tokenOut: token_out,
    fee: feeTier,
    amount: amountOut,
    sqrtPriceLimitX96: 0,
  };

  const results = await IQuoterV2.callStatic.quoteExactOutputSingle(params);
  const amountIn = ethers.utils.formatUnits(results[0], decimal_in);
  const estimateGas = ethers.utils.formatUnits(results[3], 0);
  const estimateGasFee = parseFloat(estimateGas) * parseFloat(gasPriceEth);

  return { amountIn, estimateGasFee };
}
