import { ethers } from "ethers";
import QuoterV2 from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json" assert { type: "json" };
import dotenv from "dotenv";

dotenv.config();

const treasuryPrivateKey = process.env.TREASURY_PRIVATE_KEY;
const treasuryProvider = new ethers.providers.JsonRpcProvider(
  "http://localhost:8545"
);
const treasuryWallet = new ethers.Wallet(treasuryPrivateKey, treasuryProvider);

const gasPrice = await treasuryProvider.getGasPrice();

console.log(ethers.utils.formatUnits(gasPrice, 18) + " ETH");

const IQuoterV2 = new ethers.Contract(
  "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
  QuoterV2.abi,
  treasuryProvider
);

const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const COMP = "0xc00e94cb662c3520282e6f5717214004a7f26888";
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const AAVE = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
const amountIn = ethers.utils.parseUnits("30", 18);
const amountOut = ethers.utils.parseUnits("1", 18);

console.log(amountOut);

const params = {
  tokenIn: AAVE, // replace with your token address
  tokenOut: WETH9, // replace with your token address
  fee: 3000, // replace with desired fee amount
  amountIn: amountIn, // replace with the amount you're willing to trade
  sqrtPriceLimitX96: 0, // replace with your s
};

const results = await IQuoterV2.callStatic.quoteExactInputSingle(params);

console.log(results);
console.log(ethers.utils.formatUnits(results[0], 6));
console.log(ethers.utils.formatUnits(results[1], 18));
console.log(ethers.utils.formatUnits(results[3], 0));

console.log(
  ethers.utils.formatUnits(results[3], 0) *
    ethers.utils.formatUnits(gasPrice, 18),
  "ETH"
);
