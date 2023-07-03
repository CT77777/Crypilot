import { Router, Request, Response, NextFunction } from "express";
import {
  register,
  logIn,
  renderUserProfilePage,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { JWTPayload } from "jose";

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

const router = Router();

// user register
router.route("/user/register").post(register);

// user log in
router.route("/user/login").post(logIn);

// render user profile page
router
  .route("/user/profile")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      renderUserProfilePage(req as RequestWithPayload, res),
  ]);

export default router;
