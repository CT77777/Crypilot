import { Router, Request, Response, NextFunction } from "express";
import {
  renderBuyPage,
  buyETH,
  swapEthToErc20,
  swapErc20ToEth,
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
    (req: Request, res: Response) => buyETH(req as RequestWithPayload, res),
  ]);

// render swapping ETH page
router.route("/trade/swap").get();

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

export default router;
