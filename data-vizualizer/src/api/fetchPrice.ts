import axios from "axios";
import { getProxy } from "@/utils/env";

type TMarketPrice = {
  lowest_price: string;
  median_price: string;
  success: boolean;
  volume: string;
};

const getPrice = async (name: string, game: string) => {
  const proxy = getProxy();
  const url = new URL("https://steamcommunity.com/market/priceoverview/");
  const params = new URLSearchParams({
    appid: game,
    currency: "6",
    market_hash_name: name,
    l: "english",
  });
  url.search = params.toString();
  const linkWithProxy = `${proxy}${encodeURIComponent(url.href)}`;
  const response = await axios.get<TMarketPrice>(linkWithProxy);
  if (!response.data.success) throw new Error("Success false");
  if (!response.data) throw new Error("Data not found");
  if (!response.data.lowest_price) throw new Error("Price not found");
  return response.data.lowest_price;
};

export type { TMarketPrice };
export { getPrice };
