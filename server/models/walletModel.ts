import { ethers } from "ethers";
import dotenv from "dotenv";
import dbPool from "./dbPool.js";
import { RowDataPacket, FieldPacket } from "mysql2";
import { quoteExactInputSwapToken } from "./tradeModel.js";
import { RPC_URL, contract_ABI, token_address } from "../config/config.js";

dotenv.config();

// ERC20 interface
const erc20Abi = contract_ABI.ERC20;

const treasuryProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

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
  const { WETH, UDST, USDC } = token_address;

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

      if (contract_address === WETH) {
        const ethBalanceFormat = await getUserEthBalance(user_wallet_address);

        element["balance"] = ethBalanceFormat;
        element["value"] = parseFloat(ethBalanceFormat) * parseFloat(ethPrice);

        return element;
      } else if (contract_address === USDC || contract_address === UDST) {
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
