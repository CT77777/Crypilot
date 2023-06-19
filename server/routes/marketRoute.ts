import { Router } from "express";
import {
  renderMarketFTPage,
  getMarketFTList,
} from "../controllers/marketController.js";

const router = Router();

router.route("/market/ft").get(renderMarketFTPage);

router.route("/market/ft/list").get(getMarketFTList);

router.route("/market/nft").get();

export default router;
