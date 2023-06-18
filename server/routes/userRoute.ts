import { Router } from "express";
import { renderUserPage, register } from "../controllers/userController.js";

const router = Router();

router.route("/user").get(renderUserPage);

router.route("/user/register").post(register);

router.route("/user/login").post();

export default router;
