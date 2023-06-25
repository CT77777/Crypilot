import { Router, Request, Response, NextFunction } from "express";
import {
  renderTradePage,
  buyETH,
  swapEth,
} from "../controllers/tradeController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

const router = Router();

// render buying ETH by fiat currency page
router.route("/trade").get(renderTradePage);

// buy ETH by fiat currency
router
  .route("/trade/buy")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) => buyETH(req as RequestWithPayload, res),
  ]);

// swap ETH to specified FT
router
  .route("/trade/swap")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) => swapEth(req as RequestWithPayload, res),
  ]);

// swap specified FT to ETH

export default router;
