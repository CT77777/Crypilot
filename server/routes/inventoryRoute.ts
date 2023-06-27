import { Router, Request, Response, NextFunction } from "express";
import {
  renderInventoryPage,
  getInventoryFts,
} from "../controllers/inventoryController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

const router = Router();

//render inventory page
router.route("/inventory").get(renderInventoryPage);

//get FT inventory
router
  .route("/inventory/wallet")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      getInventoryFts(req as RequestWithPayload, res),
  ]);

export default router;
