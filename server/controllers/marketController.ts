import { Request, Response } from "express";
import dotenv from "dotenv";
import {
  selectCmcIdsFT,
  fetchQuoteFT,
  fetchFTLogo,
  insertFavoriteFT,
  removeFavoriteFT,
  getFavoriteListFT,
} from "../models/marketModel.js";

dotenv.config();

export function renderMarketPageFT(req: Request, res: Response) {
  const { name, picture, public_address } = res.locals.payload;

  const data = {
    title: "Market",
    name: name,
    picture: picture,
    public_address: public_address,
  };

  res.status(200).render("marketFT", data);
}

export async function fetchMarketInfoFT(req: Request, res: Response) {
  try {
    // get tracing FTs
    let ids;
    if (req.query.ids) {
      const idsString = (req.query.ids as string).split(",");
      ids = idsString.map((element) => {
        return parseInt(element);
      });
    }

    const ft_cmc_ids = await selectCmcIdsFT();

    const ft_ids = ids || ft_cmc_ids;
    const { ftIds, ftList } = await fetchQuoteFT(ft_ids);
    const logoList = await fetchFTLogo(ftIds);

    for (let id in logoList) {
      ftList[id].logo = logoList[id];
    }

    res.status(200).json({ data: { ftList } });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: { message: "fetch FT market info failed" } });
  }
}

export function renderTracingPageFT(req: Request, res: Response) {
  const { name, picture, public_address } = res.locals.payload;

  const data = {
    title: "Tracing",
    name: name,
    picture: picture,
    public_address: public_address,
  };

  res.status(200).render("tracingFT", data);
}

export async function addTracingFT(req: Request, res: Response) {
  const { id: user_id } = res.locals.payload;
  const { cmc_id } = req.body;
  const isAdded = await insertFavoriteFT(user_id as number, cmc_id);

  res.status(200).json({ isAdded });
}

export async function removeTracingFT(req: Request, res: Response) {
  const { id: user_id } = res.locals.payload;
  const { cmc_id } = req.body;
  const isRemoved = await removeFavoriteFT(user_id as number, cmc_id);

  res.status(200).json({ isRemoved });
}

export async function getTracingListFT(req: Request, res: Response) {
  const { id: user_id } = res.locals.payload;
  const ftTracingIds = await getFavoriteListFT(user_id as number);

  res.status(200).json({ data: { ftTracingIds } });
}
