export const RPC_URL = "http://localhost:8545";

export const SOCKET_URL = "wss://localhost:8080";

export const token_address = {
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  UDST: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
};

export const uniswap_address = {
  QuoterV2: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
};

export const contract_ABI = {
  ERC20: [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",

    // Write Functions
    "function transfer(address to, uint amount) returns (bool)",
    "function deposit() public payable",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function withdraw(uint256 wad) public",
  ],
  simple_swap: [
    // Write Functions
    "function swapExactOutputSingle(address tokenAddressOut, uint256 amountOut, uint256 amountInMaximum, uint24 feeTier) external returns (uint256 amountIn)",
    "function swapExactInputSingle(address tokenAddressIn, uint256 amountIn, uint24 feeTier) external returns (uint256 amountOut)",
  ],
};

export const SWAP_TOKEN_CMC_IDS = [
  3717, 4943, 825, 3408, 8104, 7278, 5692, 7083, 6758,
];
