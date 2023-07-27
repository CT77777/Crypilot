import { Router } from "express";
import { renderHomePage } from "../controllers/homeController.js";

const router = Router();

// render home page
router.route("/").get(renderHomePage);

export default router;
