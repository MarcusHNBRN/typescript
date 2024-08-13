import React from "react";
import { Stock } from "../types";
import styles from "../css/StockList.module.css";

interface StockListProps {
  stocks: Stock[];
  onRemoveStock: (symbol: string) => void;
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  onRemoveStock,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price</th>
          <th>Change</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => (
          <tr key={stock.symbol}>
            <td>{stock.symbol}</td>
            <td>${stock.price.toFixed(2)}</td>
            <td style={{ color: stock.change >= 0 ? "green" : "red" }}>
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}%
            </td>
            <td>
              <button onClick={() => onRemoveStock(stock.symbol)}>
                remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
