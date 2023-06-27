// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract SimpleSwap {
   ISwapRouter public immutable swapRouter;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    // uint24 public constant feeTier = 3000;

   constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

  function swapExactInputSingle(address tokenAddressIn, uint256 amountIn, uint24 feeTier) external returns (uint256 amountOut) {
    // Transfer the specified amount of WETH9 to this contract.
    TransferHelper.safeTransferFrom(tokenAddressIn, msg.sender, address(this), amountIn);

    // Approve the router to spend WETH9.
    TransferHelper.safeApprove(tokenAddressIn, address(swapRouter), amountIn);  

    ISwapRouter.ExactInputSingleParams memory params =
      ISwapRouter.ExactInputSingleParams({
          tokenIn: tokenAddressIn,
          tokenOut: WETH9,
          fee: feeTier,
          recipient: msg.sender,
          deadline: block.timestamp + 45 seconds,
          amountIn: amountIn,
          amountOutMinimum: 0,
          sqrtPriceLimitX96: 0
      });
      // The call to `exactInputSingle` executes the swap.
      amountOut = swapRouter.exactInputSingle(params);
      return amountOut; 
  }

  function swapExactOutputSingle(address tokenAddressOut, uint256 amountOut, uint256 amountInMaximum, uint24 feeTier) external returns (uint256 amountIn) {
      // Transfer the specified `amountInMaximum` of WETH to this contract.
      TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountInMaximum);

      // Approve the router to spend the specifed `amountInMaximum` of WETH.
      // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
      TransferHelper.safeApprove(WETH9, address(swapRouter), amountInMaximum);

      ISwapRouter.ExactOutputSingleParams memory params =
          ISwapRouter.ExactOutputSingleParams({
              tokenIn: WETH9,
              tokenOut: tokenAddressOut,
              fee: feeTier,
              recipient: msg.sender,
              deadline: block.timestamp + 45 seconds,
              amountOut: amountOut,
              amountInMaximum: amountInMaximum,
              sqrtPriceLimitX96: 0
          });

      // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
      amountIn = swapRouter.exactOutputSingle(params);

      // For exact output swaps, the amountInMaximum may not have all been spent.
      // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
      if (amountIn < amountInMaximum) {
          TransferHelper.safeApprove(WETH9, address(swapRouter), 0);
          TransferHelper.safeTransfer(WETH9, msg.sender, amountInMaximum - amountIn);
      }

      return amountIn;
  }
}