import { Router } from "express";
import {
  renderUserPage,
  register,
  signIn,
  renderUserProfilePage,
} from "../controllers/userController.js";

const router = Router();

// render user register/signIn page
router.route("/user").get(renderUserPage);

// register API
router.route("/user/register").post(register);

// signIn API
router.route("/user/login").post(signIn);

// render user profile page
router.route("/user/profile").get(renderUserProfilePage);

export default router;
