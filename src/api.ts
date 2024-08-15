import { Stock } from "./types";

const API_KEY = process.env.API_KEY;

console.log("API Key defined:", !!API_KEY);

export async function searchStocks(query: string): Promise<Stock[]> {
  console.log("Searching for:", query);

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
    );
    const data = await response.json();

    console.log("Full API Response:", data);

    if (data.Note) {
      console.warn("API Limit Message:", data.Note);
      throw new Error("API call limit reached");
    }

    if (data.bestMatches) {
      return data.bestMatches.map((match: any) => ({
        symbol: match["1. symbol"],
        name: match["2. name"],
        price: 0,
        change: 0,
      }));
    } else {
      console.warn("Unexpected API response structure:", data);
      return [];
    }
  } catch (error) {
    console.error("Error searching stocks:", error);
    throw error;
  }
}

export async function fetchStockData(symbol: string): Promise<Stock | null> {
  console.log("Fetching stock data for:", symbol);

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    console.log("Full API Response for stock data:", data);

    if (data.Note) {
      console.warn("API Limit Message:", data.Note);
      throw new Error("API call limit reached");
    }

    if (data["Global Quote"]) {
      const quote = data["Global Quote"];
      return {
        symbol: quote["01. symbol"],
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        name: "",
      };
    } else {
      console.warn("Unexpected API response structure for stock data:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
}

export async function fetchHistoricalData(
  symbol: string,
  interval: string
): Promise<any[]> {
  console.log(
    "Fetching historical data for:",
    symbol,
    "with interval:",
    interval
  );

  let function_name;
  switch (interval) {
    case "1M":
      function_name = "TIME_SERIES_DAILY";
      break;
    case "1Y":
    case "5Y":
    case "10Y":
      function_name = "TIME_SERIES_WEEKLY";
      break;
    default:
      throw new Error("Invalid interval");
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=${function_name}&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    console.log("Full API Response for historical data:", data);

    if (data.Note) {
      console.warn("API Limit Message:", data.Note);
      throw new Error("API call limit reached");
    }

    let timeSeries;
    if (function_name === "TIME_SERIES_DAILY") {
      timeSeries = data["Time Series (Daily)"];
    } else {
      timeSeries = data["Weekly Time Series"];
    }

    if (timeSeries) {
      return Object.entries(timeSeries)
        .map(([date, values]: [string, any]) => ({
          date,
          price: parseFloat(values["4. close"]),
        }))
        .reverse();
    } else {
      console.warn(
        "Unexpected API response structure for historical data:",
        data
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
}
