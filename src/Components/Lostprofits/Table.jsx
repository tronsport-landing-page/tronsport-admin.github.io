import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const Table = ({ data, coinprice,LoadingTable }) => {
  const [tableData, settableData] = useState(data);
  const [coinPrice, setcoinPrice] = useState(coinprice);

  useEffect(() => {
    settableData(data);
    setcoinPrice(coinprice);
  }, [data, coinPrice]);

  return (
    <div className="TableDivWrap">
      <div className="rec">
        <div className="search">
          <div className="inp">
            <input className="searchinp" placeholder="Search" />
            <button className="copybtn">Search</button>
          </div>
        </div>
        <div className="recdiv">
          {!LoadingTable ?
          <table>
            <tr>
              <th style={{minWidth:"50px"}}>Date</th>
              <th style={{minWidth:"380px"}}>Recieved From ID</th>
              <th style={{minWidth:"220px"}}>The amount of TRX</th>
              <th style={{minWidth:"50px"}}>USD</th>
            </tr>

            {tableData.map((item, index) => (
              <tr>
                <td className="tbval">{index + 1}</td>
                <td className="tbval">{item.id}</td>
                <td className="tbval">{item.coins}</td>
                <td className="tbval">{item.coins * coinPrice.toFixed(4)}</td>
              </tr>
            ))}
          </table>
          :
        <Spinner variant="primary" size="100px" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      }
        </div>
      </div>
    </div>
  );
};

export default Table;
