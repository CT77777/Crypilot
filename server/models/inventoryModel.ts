import { ethers } from "ethers";
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

export async function getEthBalance(user_wallet_address: string) {
  const ethBalanceWei = await treasuryProvider.getBalance(user_wallet_address);
  const ethBalanceEther = ethers.utils.formatEther(ethBalanceWei);
  return ethBalanceEther;
}
