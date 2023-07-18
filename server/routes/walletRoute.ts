import { Router, Request, Response, NextFunction } from "express";
import {
  renderWalletPage,
  getWalletETH,
  getWalletFts,
} from "../controllers/walletController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

const router = Router();

//render wallet page
router
  .route("/wallet")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      renderWalletPage(req as RequestWithPayload, res),
  ]);

//get ETH of user's wallet
router
  .route("/wallet/eth")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      getWalletETH(req as RequestWithPayload, res),
  ]);

//get FTs of user's wallet
router
  .route("/wallet/fts")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      getWalletFts(req as RequestWithPayload, res),
  ]);

export default router;
