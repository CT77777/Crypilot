import { Router } from "express";
import {
  register,
  logIn,
  renderUserProfilePage,
  retrievePrivateKey,
  setSecondAuthentication,
  verifySecondAuthentication,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

// user register
router.route("/user/register").post(register);

// user log in
router.route("/user/login").post(logIn);

// user 2fa set up
router.route("/user/2fa").get([authenticate, setSecondAuthentication]);

// user 2fa verified
router.route("/user/2fa").post(verifySecondAuthentication);

// render user profile page
router.route("/user/profile").get([authenticate, renderUserProfilePage]);

// retrieve user's secret key
router.route("/user/private").get([authenticate, retrievePrivateKey]);

export default router;
