import { Router } from "express";
import { renderHomePage } from "../controllers/homeController.js";

const router = Router();

router.route("/").get(renderHomePage);

export default router;
