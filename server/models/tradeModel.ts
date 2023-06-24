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
