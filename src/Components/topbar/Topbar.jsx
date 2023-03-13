import React, { useEffect, useState } from "react";
import "./Topbar.css";
import logo from "./logo.png";
import { RiProfileLine } from "react-icons/ri";
import { BsFillSuitDiamondFill } from "react-icons/bs";
import britain from "./britain.png";
import useWindowDimensions from "../../Tools/WindowDimensions";
import { useSelector, useDispatch } from "react-redux";
import { toogleMenu, getTooglemenu } from "../Redux/Reducer/MenuReducer";
import { getPreviewModeId } from "../Redux/Reducer/PreviewMode";
import { getuserId } from "../Redux/Reducer/UserId";
import successIcon from "../../Assets/success.svg"
function Topbar(opensidebar, opened) {
  const { height, width } = useWindowDimensions();

  const previewId = useSelector(getPreviewModeId);
  const userID = useSelector(getuserId);

  let walletId = previewId || window.tronLink.tronWeb.defaultAddress.base58;

  const menu = useSelector(getTooglemenu);
  const dispatch = useDispatch();

  return (
    <div className="topbar">
      <div className="topbarcontainer">
        {/* <div className="leftcontent">
                        <img src={logo} alt="logo" className="logo"></img>
                </div> */}

        {width <= 860 && (
          <div className="div0">
            <div onClick={() => dispatch(toogleMenu(!menu))} className="menu">
              <img src="https://img.icons8.com/material-outlined/48/000000/menu--v1.png" />{" "}
            </div>
          </div>
        )}
        <div className="div1">
          <div className="contentDiv">
            <span className="address">Id : {userID}</span>
          </div>
        </div>

        <div className="div2">
          <div style={{ marginLeft: "-12.5%" }} className="contentDiv">
            <span style={{marginRight:"5px"}}>
              <div
                style={{ overflow: "hidden", width: 30, height: 30 }}
                className="LanguageDiv"
              >
                <img
                  alt=""
                  width="25"
                  height="25"
                  src={successIcon}
                />
              </div>
            </span>
            <span className="address">
              Address:{" "}
              <a
                target="_blank"
                href={`https://tronscan.org/#/address/${walletId}`}
              >
                {walletId}
              </a>
            </span>
          </div>
        </div>

       
      </div>
    </div>
  );
}
export default Topbar;
