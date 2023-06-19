import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

interface Coin {
  id: number;
  name: string;
  symbol: string;
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

interface FTListResultsData {
  status: object;
  data: { coins: Coin[] };
}

interface LogoResultsData {
  status: object;
  data: Record<string, { logo: string; id: number }>;
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

export async function fetchFTList() {
  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=618c0beeb7dd913155b462f9&start=1&limit=10&CMC_PRO_API_KEY=${process.env.COINMARKETCAP_API_KEY}`
    );
    const results = (await response.json()) as FTListResultsData;
    const fts = results.data.coins;
    const ftIds: number[] = [];
    const ftList: Record<string, FTList> = {};

    fts.forEach((element) => {
      ftIds.push(element.id);
      const ft = {
        id: element.id,
        name: element.name,
        symbol: element.symbol,
        price: element.quote[`USD`].price,
        logo: "",
        volume_24h: element.quote[`USD`].volume_24h,
        percent_change_24h: element.quote[`USD`].percent_change_24h,
        percent_change_7d: element.quote[`USD`].percent_change_7d,
        percent_change_30d: element.quote[`USD`].percent_change_30d,
        market_cap: element.quote[`USD`].market_cap,
      };
      ftList[`${element.id}`] = ft;
    });

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
