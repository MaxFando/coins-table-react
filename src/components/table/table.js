import React, { useReducer, useEffect } from "react";
import TableRow from "../table-row";
import ApiService from "../../services/api-service";

import "./table.scss";

function reducer(state, action) {
  switch (action.type) {
    case "initializing":
      return (state.info = action.coins);
    case "update":
      return (state.info[action.base] = action.coins);
    default:
      throw new Error();
  }
}

const Table = () => {
  const apiSerivice = new ApiService();
  // const [info, setInfo] = useState({});
  const [info, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    apiSerivice.getAssets().then(coins => {
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

      // setInfo(info);
      dispatch({ type: "initializing", coins: info });
    });
  }, []);

  useEffect(() => {
    const tradeWs = new WebSocket("wss://ws.coincap.io/trades/binance");

    tradeWs.onmessage = function(msg) {
      const { base, priceUsd, volume } = JSON.parse(msg.data);

      if (info.hasOwnProperty(base)) {
        const prevValues = Object.values(info[base]);
        const updatedValues = {
          priceUsd: priceUsd,
          vwap24Hr: volume
        };
        const newInfo = { ...prevValues, ...updatedValues };

        dispatch({ type: "update", coins: newInfo, base: base });

        // setInfo(prevState => {
        //   return { ...prevState, ...updatedValues };
        // });
      }
    };
  }, [info]);

  const parseToFloat = item => {
    const convertNumber = number => {
      return Math.abs(Number(number)) >= 1.0e9
        ? parseFloat(Math.abs(Number(number)) / 1.0e9).toFixed(2) + "B"
        : Math.abs(Number(number)) >= 1.0e6
        ? parseFloat(Math.abs(Number(number)) / 1.0e6).toFixed(2) + "M"
        : Math.abs(Number(number)) >= 1.0e3
        ? parseFloat(Math.abs(Number(number)) / 1.0e3).toFixed(2) + "K"
        : Math.abs(Number(number));
    };

    Object.keys(item).map(key => {
      if (
        !["id", "rank", "name", "symbol", "changePercent24Hr"].includes(key)
      ) {
        item[key] = convertNumber(parseFloat(item[key]).toFixed(2));
      }
      item["changePercent24Hr"] = parseFloat(item["changePercent24Hr"]).toFixed(
        2
      );

      return item;
    });
  };

  const elements = Object.values(info).map(element => (
    <TableRow
      coin={element}
      key={element.rank}
      isGrow={element.changePercent24Hr > 0}
    />
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
