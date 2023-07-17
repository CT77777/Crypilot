import { ethers } from "ethers";
import dotenv from "dotenv";
import dbPool from "./dbPool.js";
import { RowDataPacket, FieldPacket } from "mysql2";
import { quoteExactInputSwapToken } from "./tradeModel.js";

dotenv.config();

// ERC20 interface
const erc20Abi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() public payable",
  "function approve(address spender, uint256 amount) returns (bool)",
];

const treasuryProvider = new ethers.providers.JsonRpcProvider(
  "http://localhost:8545"
);

// get ETH balance from blockchain
export async function getUserEthBalance(user_wallet_address: string) {
  const ethBalanceWei = await treasuryProvider.getBalance(user_wallet_address);
  const ethBalanceEther = ethers.utils.formatEther(ethBalanceWei);
  return ethBalanceEther;
}

// get FTs(ERC20) balance from blockchain
export async function getUserFtsBalance(
  user_wallet_address: string,
  ft_contract_addresses: RowDataPacket[]
) {
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const UDST = "0xdac17f958d2ee523a2206206994597c13d831ec7";

  const { amountOut: ethPrice } = await quoteExactInputSwapToken(
    WETH,
    UDST,
    "1",
    18,
    6
  );

  const userFtsBalance = await Promise.all(
    ft_contract_addresses.map(async (element) => {
      const { contract_address } = element;

      if (contract_address === "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2") {
        const ethBalanceFormat = await getUserEthBalance(user_wallet_address);

        element["balance"] = ethBalanceFormat;
        element["value"] = parseFloat(ethBalanceFormat) * parseFloat(ethPrice);

        return element;
      } else if (
        contract_address === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" ||
        contract_address === "0xdac17f958d2ee523a2206206994597c13d831ec7"
      ) {
        const erc20 = new ethers.Contract(
          contract_address,
          erc20Abi,
          treasuryProvider
        );
        const erc20Balance = await erc20.balanceOf(user_wallet_address);
        const erc20BalanceFormat = ethers.utils.formatUnits(erc20Balance, 6);

        element["balance"] = erc20BalanceFormat;
        element["value"] = erc20BalanceFormat;

        return element;
      } else {
        const erc20 = new ethers.Contract(
          contract_address,
          erc20Abi,
          treasuryProvider
        );
        const erc20Balance = await erc20.balanceOf(user_wallet_address);
        const erc20BalanceFormat = ethers.utils.formatUnits(erc20Balance, 18);

        if (erc20BalanceFormat !== "0.0") {
          const { amountOut } = await quoteExactInputSwapToken(
            contract_address,
            WETH,
            erc20BalanceFormat,
            18,
            18
          );

          element["balance"] = erc20BalanceFormat;
          element["value"] = parseFloat(ethPrice) * parseFloat(amountOut);

          return element;
        } else {
          element["balance"] = "0";
          element["value"] = "0";

          return element;
        }
      }
    })
  );

  return userFtsBalance;
}

// get user's inventory FTs from DB
export async function getUserFts(user_id: number) {
  const ftsResults: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `
    SELECT ft_cmc_id, name, symbol, contract_address FROM user_inventory_fts
    INNER JOIN fts ON user_inventory_fts.ft_cmc_id = fts.cmc_id
    WHERE user_id = ?
  `,
    [user_id]
  );

  return ftsResults[0];
}
