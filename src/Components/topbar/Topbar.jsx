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

        {width <= 850 && (
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
          <div className="contentDiv">
            <span  style={{ width: "calc(100% - 25px)" }} className="address">
              Address: <a target="_blank" href={`https://tronscan.org/#/address/${walletId}`} >{walletId}</a>
            </span>
            <span style={{ float: "right", position: "absolute", right: 10 }}>
              <div
                style={{ overflow: "hidden", width: 30, height: 30 }}
                className="LanguageDiv"
              >
                <img
                  alt=""
                  width="25"
                  height="25"
                  src="https://avatars.githubusercontent.com/u/64833303?s=96&v=4"
                />
              </div>
            </span>
          </div>
        </div>

        <div className="div3">
          {/* <div className="LanguageDiv">
            <img
              className="image"
              style={{ width: "100%", height: "100%" }}
              src={britain}
              alt="aa"
              width="40px"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
export default Topbar;
