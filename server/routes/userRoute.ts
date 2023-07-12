import { Router, Request, Response, NextFunction } from "express";
import {
  register,
  logIn,
  renderUserProfilePage,
  retrievePrivateKey,
  setSecondAuthentication,
  verifySecondAuthentication,
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

// user 2fa set up
router
  .route("/user/2fa")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      setSecondAuthentication(req as RequestWithPayload, res),
  ]);

// user 2fa verified
router.route("/user/2fa").post(verifySecondAuthentication);

// render user profile page
router
  .route("/user/profile")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      renderUserProfilePage(req as RequestWithPayload, res),
  ]);

// retrieve user's secret key
router
  .route("/user/private")
  .get([
    (req: Request, res: Response, next: NextFunction) =>
      authenticate(req as RequestWithPayload, res, next),
    (req: Request, res: Response) =>
      retrievePrivateKey(req as RequestWithPayload, res),
  ]);

export default router;
