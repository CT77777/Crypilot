import { Request, Response } from "express";
import dotenv from "dotenv";
import { fetchFTList, fetchFTLogo } from "../models/marketModel.js";

dotenv.config();

export async function renderMarketFTPage(req: Request, res: Response) {
  try {
    const { ftIds, ftList } = await fetchFTList();
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
