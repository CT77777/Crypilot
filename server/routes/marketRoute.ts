import { Router, Request, Response, NextFunction } from "express";
import {
  renderMarketFTPage,
  getMarketFTList,
  renderTracingPage,
  getTracingListFT,
  addTracingFT,
  removeTracingFT,
} from "../controllers/marketController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

const router = Router();

router.route("/market/ft").get(renderMarketFTPage);

router.route("/market/ft/list").get(getMarketFTList);

router.route("/market/tracing").get(renderTracingPage);

router
  .route("/market/ft/list/tracing")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      getTracingListFT(req as RequestWithPayload, res),
  ]);

router
  .route("/market/ft/tracing/add")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      addTracingFT(req as RequestWithPayload, res),
  ]);

router
  .route("/market/ft/tracing/remove")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      removeTracingFT(req as RequestWithPayload, res),
  ]);

router.route("/market/nft").get();

export default router;
