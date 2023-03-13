import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const Table = ({ data,LoadingTable }) => {
  const [tableData, settableData] = useState(data);
  useEffect(() => {
    settableData(data);
  }, [data]);
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
              <th style={{minWidth:"50px"}} >Line</th>
              <th style={{minWidth:"50px"}}>ID</th>
              <th style={{minWidth:"380px"}}>Wallet</th>
              <th style={{minWidth:"50px"}}>Level</th>
            </tr>
            {tableData.map((item, index) => (
              index == 0 && (
                <tr>
                <td className="tbval">{index + 1}</td>
                <td className="tbval">{item.id}</td>
                <td className="tbval">
                <a target="_blank" href={`https://tronscan.org/#/address/${item.address}`}>{item.address}</a>
                </td>
                <td className="tbval">{item.currentLevel}</td>
              </tr>
              )
             
            ))}
          </table>

          : (
        <Spinner
          variant="primary"
          size="100px"
          animation="border"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
        </div>
      </div>
    </div>
  );
};

export default Table;
