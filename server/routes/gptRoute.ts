import { Router, Request, Response, NextFunction } from "express";
import { startChat, continueChat } from "../controllers/gptController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

const router = Router();

// start a chat with open AI
router
  .route("/gpt/start")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) => startChat(req as RequestWithPayload, res),
  ]);

// continue a chat with open AI
router
  .route("/gpt/continue")
  .post([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      continueChat(req as RequestWithPayload, res),
  ]);

export default router;
