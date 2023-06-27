import dotenv from "dotenv";
import fetch from "node-fetch";
import dbPool from "./dbPool.js";
import { OkPacket, RowDataPacket, FieldPacket } from "mysql2";

dotenv.config();

interface Coin {
  id: number;
  name: string;
  symbol: string;
  platform: { token_address: string };
  quote: Record<
    string,
    {
      price: number;
      volume_24h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      market_cap: number;
    }
  >;
}

interface FTsResultsData {
  status: object;
  data: Record<string, Coin>;
}

interface LogoResultsData {
  status: object;
  data: Record<string, { id: number; logo: string }>;
}

type FTList = {
  id: number;
  name: string;
  symbol: string;
  price: number;
  logo: string;
  volume_24h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  market_cap: number;
};

// 1027,3717,4943,825,3408,8104,7278,5692,7083,6758
export async function fetchFTList(ft_ids: number[]) {
  try {
    const ftIdsConcat = ft_ids.join(",");
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${ftIdsConcat}&CMC_PRO_API_KEY=${process.env.COINMARKETCAP_API_KEY}`
    );
    const results = (await response.json()) as FTsResultsData;
    const fts = results.data;
    const ftIds: number[] = [];
    const ftList: Record<string, FTList> = {};

    for (let id in fts) {
      const ftInfo = fts[id];
      ftIds.push(ftInfo.id);
      if (ftInfo.symbol !== "ETH") {
        const ft = {
          id: ftInfo.id,
          name: ftInfo.name,
          symbol: ftInfo.symbol,
          price: ftInfo.quote[`USD`].price,
          logo: "",
          token_address: ftInfo.platform.token_address,
          volume_24h: ftInfo.quote[`USD`].volume_24h,
          percent_change_24h: ftInfo.quote[`USD`].percent_change_24h,
          percent_change_7d: ftInfo.quote[`USD`].percent_change_7d,
          percent_change_30d: ftInfo.quote[`USD`].percent_change_30d,
          market_cap: ftInfo.quote[`USD`].market_cap,
        };
        ftList[`${ftInfo.id}`] = ft;
      } else {
        const ft = {
          id: ftInfo.id,
          name: ftInfo.name,
          symbol: ftInfo.symbol,
          price: ftInfo.quote[`USD`].price,
          logo: "",
          volume_24h: ftInfo.quote[`USD`].volume_24h,
          percent_change_24h: ftInfo.quote[`USD`].percent_change_24h,
          percent_change_7d: ftInfo.quote[`USD`].percent_change_7d,
          percent_change_30d: ftInfo.quote[`USD`].percent_change_30d,
          market_cap: ftInfo.quote[`USD`].market_cap,
        };
        ftList[`${ftInfo.id}`] = ft;
      }
    }

    // fts.forEach((element) => {
    //   ftIds.push(element.id);
    //   const ft = {
    //     id: element.id,
    //     name: element.name,
    //     symbol: element.symbol,
    //     price: element.quote[`USD`].price,
    //     logo: "",
    //     volume_24h: element.quote[`USD`].volume_24h,
    //     percent_change_24h: element.quote[`USD`].percent_change_24h,
    //     percent_change_7d: element.quote[`USD`].percent_change_7d,
    //     percent_change_30d: element.quote[`USD`].percent_change_30d,
    //     market_cap: element.quote[`USD`].market_cap,
    //   };
    //   ftList[`${element.id}`] = ft;
    // });

    return { ftIds, ftList };
  } catch (error) {
    console.log(error);
    return { ftIds: [], ftList: {} };
  }
}

export async function fetchFTLogo(ft_ids: number[]) {
  try {
    const ftIdsConcat = ft_ids.join(",");
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${ftIdsConcat}&CMC_PRO_API_KEY=${process.env.COINMARKETCAP_API_KEY}`
    );
    const results = (await response.json()) as LogoResultsData;
    const tokenList = results.data;
    const logoList: Record<string, string> = {};

    for (let id in tokenList) {
      logoList[`${tokenList[id].id}`] = tokenList[id].logo;
    }

    return logoList;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function insertFavoriteFT(user_id: number, cmc_id: number) {
  try {
    await dbPool.query(
      `
      INSERT INTO user_favorite_fts (user_id, ft_cmc_id)
      VALUES (?, ?)
    `,
      [user_id, cmc_id]
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeFavoriteFT(user_id: number, cmc_id: number) {
  try {
    await dbPool.query(
      `
      DELETE FROM user_favorite_fts
      WHERE user_id = ? AND ft_cmc_id = ?
    `,
      [user_id, cmc_id]
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getFavoriteListFT(user_id: number) {
  try {
    const results: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
      `
      SELECT ft_cmc_id FROM user_favorite_fts
      WHERE user_id = ?
    `,
      [user_id]
    );

    const ftTracingIds: number[] = [];

    results[0].forEach((element) => {
      ftTracingIds.push(element.ft_cmc_id);
    });

    return ftTracingIds;
  } catch (error) {
    console.log(error);
    return false;
  }
}
