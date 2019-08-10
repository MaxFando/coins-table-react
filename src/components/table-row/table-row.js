import React from "react";

import "./table-row.scss";

const TableRow = props => {
  const { coin } = props;

  return (
    <div className="table__row">
      <span className="table__field rank">{coin.rank}</span>
      <span className="table__field">{coin.name}</span>
      <span className="table__field">${coin.priceUsd}</span>
      <span className="table__field">${coin.marketCapUsd}</span>
      <span className="table__field">${coin.vwap24Hr}</span>
      <span className="table__field">{coin.supply}m</span>
      <span className="table__field">${coin.volumeUsd24Hr}b</span>
      <span className="table__field">{coin.changePercent24Hr}%</span>
    </div>
  );
};

export default TableRow;
