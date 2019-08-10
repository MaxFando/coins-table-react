import React, { useState, useEffect } from "react";
import TableRow from "../table-row";
import ApiService from "../../services/api-service";

import "./table.scss";

const Table = () => {
  const apiSerivice = new ApiService();
  const [info, setInfo] = useState({});

  useEffect(() => {
    apiSerivice.getAssets().then(coins => {
      console.log(coins);
      const info = coins.reduce((acc, item) => {
        parseToFloat(item);

        acc[item["id"]] = {
          rank: item["rank"],
          name: item["name"],
          symbol: item["symbol"],
          ...item
        };

        return acc;
      }, {});

      setInfo(info);
    });
  }, []);

  useEffect(() => {
    const tradeWs = new WebSocket("wss://ws.coincap.io/trades/binance");

    tradeWs.onmessage = function(msg) {
      const { base, priceUsd, volume } = JSON.parse(msg.data);
      console.log(msg.data);

      if (info.hasOwnProperty(base)) {
        const updatedValues = {
          priceUsd: priceUsd,
          vwap24Hr: volume
        };

        setInfo(prevState => {
          return { ...prevState, ...updatedValues };
        });
      }
    };
  }, [info]);

  const parseToFloat = item => {
    Object.keys(item).map(key => {
      if (!["id", "rank", "name", "symbol"].includes(key)) {
        item[key] = parseFloat(item[key]).toFixed(2);
      }

      return item;
    });
  };

  const elements = Object.values(info).map(element => (
    <TableRow coin={element} key={element.rank} />
  ));

  return (
    <div className="table">
      <div className="table__header">
        <div className="table__row">
          <span className="table__field rank">Rank</span>
          <span className="table__field">Name</span>
          <span className="table__field">Price</span>
          <span className="table__field">Market Cap</span>
          <span className="table__field">VWAP(24Hr)</span>
          <span className="table__field">Supply</span>
          <span className="table__field">Volume (24h)</span>
          <span className="table__field">Change (24h)</span>
        </div>
      </div>
      <div className="table__body">{elements}</div>
    </div>
  );
};

export default Table;
