import { ethers } from "ethers";
import dbPool from "./dbPool.js";
import { OkPacket, RowDataPacket, FieldPacket } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const treasuryPrivateKey = process.env.TREASURY_PRIVATE_KEY;
const treasuryProvider = new ethers.providers.JsonRpcProvider(
  "http://localhost:8545"
);
const treasuryWallet = new ethers.Wallet(
  treasuryPrivateKey as string,
  treasuryProvider
);

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18;
const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const SimpSwapAddress = process.env.SIMPLE_SWAP_ADDRESS;

const erc20Abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() public payable",
  "function approve(address spender, uint256 amount) returns (bool)",
];

const simpleSwapAbi = [
  "function swapExactOutputSingle(address tokenAddressOut, uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn)",
];

// send ETH to user from treasury wallet
export async function sendETH(user_wallet_address: string, eth_amount: string) {
  const transaction = {
    to: user_wallet_address,
    value: ethers.utils.parseEther(eth_amount),
  };
  const txResponse = await treasuryWallet.sendTransaction(transaction);
  console.log(txResponse);

  return true;
}

// swap ETH to get exact FT(ERC20) amount
export async function swapEthToToken(
  token_address: string,
  token_amount: string,
  user_private_key: string
) {
  const userPrivateKey = user_private_key;
  const userProvider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
  );
  const userWallet = new ethers.Wallet(userPrivateKey, userProvider);

  const weth = new ethers.Contract(WETH_ADDRESS, erc20Abi, userWallet);
  const deposit = await weth.deposit({ value: ethers.utils.parseEther("10") });
  await deposit.wait();

  await weth.approve(SimpSwapAddress, ethers.utils.parseEther("10"));

  const simpleSwap = new ethers.Contract(
    SimpSwapAddress as string,
    simpleSwapAbi,
    userWallet
  );

  const amountOut = ethers.utils.parseEther(token_amount);
  const amountInMaximum = ethers.utils.parseEther("10");
  const swap = await simpleSwap.swapExactOutputSingle(
    token_address,
    amountOut,
    amountInMaximum
  );
  await swap.wait();
  console.log(swap);
}

// get user private key
export async function getPrivateKey(public_address: string) {
  console.log(public_address);
  const results: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `
    SELECT private_key FROM user_wallets WHERE public_address = ?
  `,
    [public_address]
  );

  console.log(results[0][0]);
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
