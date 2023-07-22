import { Router } from "express";
import {
  renderBuyPage,
  buyEth,
  renderSwapPage,
  swapEthToErc20,
  swapErc20ToEth,
  getSwapTokens,
  quoteExactInput,
  quoteExactOutput,
} from "../controllers/tradeController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

// render buying ETH by fiat currency page
router.route("/trade/buy").get([authenticate, renderBuyPage]);

// buy ETH by fiat currency
router.route("/trade/buy").post([authenticate, buyEth]);

// render swapping ETH page
router.route("/trade/swap").get([authenticate, renderSwapPage]);

// get swap tokens
router.route("/trade/swap/tokens").get(getSwapTokens);

// swap ETH to ERC20 token
router.route("/trade/swap/buy").post([authenticate, swapEthToErc20]);

// swap ERC20 token to ETH
router.route("/trade/swap/sell").post([authenticate, swapErc20ToEth]);

// get quote of exact input swap token
router.route("/trade/quote/exact/input").post(quoteExactInput);

// get quote of exact output swap token
router.route("/trade/quote/exact/output").post(quoteExactOutput);

export default router;
