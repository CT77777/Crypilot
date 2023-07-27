import { Router } from "express";
import { startChat, continueChat } from "../controllers/gptController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

// start a chat with open AI
router.route("/gpt/start").post([authenticate, startChat]);

// continue a chat with open AI
router.route("/gpt/continue").post([authenticate, continueChat]);

export default router;
