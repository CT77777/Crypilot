const { ethers } = require("hardhat");
const dotenv = require("dotenv");

dotenv.config();

const SwapRouterV3Address = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

const treasuryPrivateKey = process.env.TREASURY_PRIVATE_KEY;
const treasuryProvider = new ethers.providers.JsonRpcProvider(
  "http://localhost:8545"
);
const treasuryWallet = new ethers.Wallet(treasuryPrivateKey, treasuryProvider);

async function main() {
  let simpleSwapFactory = await ethers.getContractFactory("SimpleSwap");
  simpleSwapFactory = simpleSwapFactory.connect(treasuryWallet);
  const simpleSwap = await simpleSwapFactory.deploy(SwapRouterV3Address);
  await simpleSwap.deployed();

  console.log(simpleSwap.address);
}

main().catch((error) => {
  console.log(error);
});
