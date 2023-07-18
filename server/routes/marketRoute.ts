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

// render market FT page
router
  .route("/market/ft")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      renderMarketFTPage(req as RequestWithPayload, res),
  ]);

// get market FT list
router.route("/market/ft/list").get(getMarketFTList);

// render user's tracing FT page
router
  .route("/market/tracing")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      renderTracingPage(req as RequestWithPayload, res),
  ]);

// get user's tracing FT list
router
  .route("/market/ft/list/tracing")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      getTracingListFT(req as RequestWithPayload, res),
  ]);

// add tracing FT
router
  .route("/market/ft/tracing/add")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      addTracingFT(req as RequestWithPayload, res),
  ]);

// remove tracing FT
router
  .route("/market/ft/tracing/remove")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      removeTracingFT(req as RequestWithPayload, res),
  ]);

export default router;
