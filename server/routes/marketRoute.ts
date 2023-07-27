import { Router } from "express";
import {
  renderMarketPageFT,
  fetchMarketInfoFT,
  renderTracingPageFT,
  getTracingListFT,
  addTracingFT,
  removeTracingFT,
} from "../controllers/marketController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

// render market FT page
router.route("/market/ft").get([authenticate, renderMarketPageFT]);

// fetch FT market info
router.route("/market/ft/list").get(fetchMarketInfoFT);

// render user's tracing FT page
router.route("/market/tracing/ft").get([authenticate, renderTracingPageFT]);

// get user's tracing FT list
router.route("/market/tracing/ft/list").get([authenticate, getTracingListFT]);

// add tracing FT
router.route("/market/tracing/ft/list").post([authenticate, addTracingFT]);

// remove tracing FT
router.route("/market/tracing/ft/list").delete([authenticate, removeTracingFT]);

export default router;
