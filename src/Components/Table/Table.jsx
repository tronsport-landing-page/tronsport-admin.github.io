import React, { useEffect, useState } from "react";

const Table = ({ data ,coinprice}) => {
  console.log(data,"HI");
  const [tableData, settableData] = useState(data);
  const [coinPrice, setcoinPrice] = useState(coinprice);

  useEffect(() => {
    settableData(data);
    setcoinPrice(coinprice)
    console.log(coinPrice);
  }, [data,coinPrice]);

  return (
    <div className="TableDivWrap">
      <div className="rec">
        <p className="linkname1">Received</p>
        <div className="search">
          <div className="inp">
            <input className="searchinp" placeholder="Search" />
            <button className="copybtn">Search</button>
          </div>
        </div>
        <div className="recdiv">
          <table>
            <tr>
              <th style={{minWidth:"50px"}} >SNo</th>
              <th style={{minWidth:"380px"}}>Received from ID</th>
              <th style={{minWidth:"220px"}}>The amount of TRX</th>
              <th style={{minWidth:"80px"}}>USD</th>
            </tr>
            {tableData.map((item, index) => (
              <tr key={index} >
                <td className="tbval">{index + 1}</td>
                <td className="tbval">{item?.id}</td>
                <td className="tbval">{item?.coins}</td>
                <td className="tbval">{item?.coins*coinPrice.toFixed(4)}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
