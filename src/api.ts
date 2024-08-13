import { Stock } from "./types";

const API_KEY = process.env.API_KEY;

export async function searchStocks(query: string): Promise<Stock[]> {
  const response = await fetch(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
  );
  const data = await response.json();

  if (data.bestMatches) {
    return data.bestMatches.map((match: any) => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
      price: 0,
      change: 0,
    }));
  }
  return [];
}

export async function fetchStockData(symbol: string): Promise<Stock | null> {
  const response = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
  );
  const data = await response.json();

  if (data["Global Quote"]) {
    const quote = data["Global Quote"];
    return {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      name: "",
    };
  }
  return null;
}
