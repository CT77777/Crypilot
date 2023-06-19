import { Router } from "express";
import { renderMarketFTPage } from "../controllers/marketController.js";

const router = Router();

router.route("/market/ft").get(renderMarketFTPage);

router.route("/market/nft").get();

export default router;
