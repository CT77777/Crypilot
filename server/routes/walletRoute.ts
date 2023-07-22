import { Router } from "express";
import {
  renderWalletPage,
  getWalletETH,
  getWalletFts,
} from "../controllers/walletController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

//render wallet page
router.route("/wallet").get([authenticate, renderWalletPage]);

//get ETH of user's wallet
router.route("/wallet/eth").get([authenticate, getWalletETH]);

//get FTs of user's wallet
router.route("/wallet/fts").get([authenticate, getWalletFts]);

export default router;
