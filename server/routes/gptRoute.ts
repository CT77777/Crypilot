import { Router } from "express";
import { startChat } from "../controllers/gptController.js";

const router = Router();

// start a chat with open AI
router.route("/gpt/start").post(startChat);

// continue a chat with open AI
router.route("/gpt/continue").post();

export default router;
