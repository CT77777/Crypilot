import { Router, Request, Response, NextFunction } from "express";
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
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

const router = Router();

// render buying ETH by fiat currency page
router.route("/trade/buy").get(renderBuyPage);

// buy ETH by fiat currency
router
  .route("/trade/buy")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) => buyEth(req as RequestWithPayload, res),
  ]);

// render swapping ETH page
router.route("/trade/swap").get(renderSwapPage);

// get swap tokens
router.route("/trade/swap/tokens").get(getSwapTokens);

// swap ETH to ERC20 token
router
  .route("/trade/swap/buy")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      swapEthToErc20(req as RequestWithPayload, res),
  ]);

// swap ERC20 token to ETH
router
  .route("/trade/swap/sell")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      swapErc20ToEth(req as RequestWithPayload, res),
  ]);

// get quote of exact input swap token
router.route("/trade/quote/exact/input").post(quoteExactInput);

// get quote of exact output swap token
router.route("/trade/quote/exact/output").post(quoteExactOutput);

// get quote of exact input swap tokens
router.route("/trade/quote/exact/inputs").post();

export default router;
