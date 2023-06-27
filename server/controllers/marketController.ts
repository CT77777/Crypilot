import { Request, Response } from "express";
import dotenv from "dotenv";
import {
  fetchFTList,
  fetchFTLogo,
  insertFavoriteFT,
  removeFavoriteFT,
  getFavoriteListFT,
} from "../models/marketModel.js";
import { JWTPayload } from "jose";

dotenv.config();

interface RequestWithPayload extends Request {
  payload: JWTPayload;
}

// cmc id of ft
const ft_cmc_ids = [1027, 3717, 4943, 825, 3408, 8104, 7278, 5692, 7083, 6758];

export async function getMarketFTList(req: Request, res: Response) {
  try {
    // get tracing FTs
    let ids;
    if (req.query.ids) {
      const idsString = (req.query.ids as string).split(",");
      ids = idsString.map((element) => {
        return parseInt(element);
      });
    }

    const ft_ids = ids || ft_cmc_ids;
    const { ftIds, ftList } = await fetchFTList(ft_ids);
    const logoList = await fetchFTLogo(ftIds);

    for (let id in logoList) {
      ftList[id].logo = logoList[id];
    }
    res.status(200).json({ ftList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "fetch failed" });
  }
}

export async function renderMarketFTPage(req: Request, res: Response) {
  res.status(200).render("ftMarket");
}

export async function addTracingFT(req: RequestWithPayload, res: Response) {
  const { id: user_id } = req.payload;
  const cmc_id = req.body.cmc_id;
  const isAdded = await insertFavoriteFT(user_id as number, cmc_id);
  res.status(200).json({ isAdded });
}

export async function removeTracingFT(req: RequestWithPayload, res: Response) {
  const { id: user_id } = req.payload;
  const cmc_id = req.body.cmc_id;
  const isRemoved = await removeFavoriteFT(user_id as number, cmc_id);
  res.status(200).json({ isRemoved });
}

export async function getTracingListFT(req: RequestWithPayload, res: Response) {
  // console.log("check", req.query.ids);
  const { id: user_id } = req.payload;
  const ftTracingIds = await getFavoriteListFT(user_id as number);
  res.status(200).json({ ftTracingIds });
}
