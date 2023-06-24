import { Router, Request, Response, NextFunction } from "express";
import {
  renderInventoryPage,
  getEHTBalance,
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
      getEHTBalance(req as RequestWithPayload, res),
  ]);

export default router;
