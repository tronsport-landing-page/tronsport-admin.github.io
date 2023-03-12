import React from "react";
import "./Sidenavbar.css";
import { FaUserCircle } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { FaNetworkWired } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaSearchDollar } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { BsBoxArrowRight } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { toogleAuth } from "../Redux/Reducer/AuthReducer";
import { useDispatch } from "react-redux";

import { ReactComponent as Logo } from "../../Assets/logo.svg";
import WalletIcon from "../../Assets/wallet.svg";
import WalletIconDark from "../../Assets/wallet-dark.svg";
import TreeIcon from "../../Assets/tree.svg";
import TreeIconDark from "../../Assets/tree-dark.svg";
import UplineIcon from "../../Assets/upline.svg";
import UplineIconDark from "../../Assets/upline-dark.svg";

function Sidenavbar() {
  const location = useLocation();
  const dispatch = useDispatch();

  const PATHNAME = () => location?.pathname?.toLowerCase();

  const VALIDROUTE = (path) => (PATHNAME(path) == path ? true : false);

  const Logout = () => {
    window.tronLink.tronWeb = false;
    dispatch(toogleAuth("LOGGEDOUT"));
  };

  return (
    <div className="sidenav">
      <div className="sidebarcontainer">
        <div className="menu">
          <div className="logodiv">
            <Logo className="logoimg" />
          </div>

          <ul className="sidebarlist">
            <Link
              className={VALIDROUTE("/") ? "Link-Active" : "Link"}
              to="/"
              style={{
                width: "240px !important",
                textDecoration: "none",
                color: "black",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <li
                style={{ color: VALIDROUTE("/") ? "white" : null }}
                className="sidebaritems"
              >
                <span className="icon">
                  {!VALIDROUTE("/") ? (
                    <img
                      src={WalletIconDark}
                      width="32"
                      alt=""
                      class="sidemenu_button_icon"
                    />
                  ) : (
                    <img
                      src={WalletIcon}
                      width="32"
                      alt=""
                      class="sidemenu_button_icon"
                    />
                  )}
                </span>
                Dashboard
              </li>
            </Link>

            <Link
              className={VALIDROUTE("/partners") ? "Link-Active" : "Link"}
              to="/Partners"
              style={{
                width: "240px !important",
                textDecoration: "none",
                color: "black",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <li
                style={{ color: VALIDROUTE("/partners") ? "white" : null }}
                className="sidebaritems"
              >
                <span className="icon">
                  {!VALIDROUTE("/partners") ? (
                    <img src={TreeIconDark} width="32" />
                  ) : (
                    <img src={TreeIcon} width="32" />
                  )}
                </span>
                Partners
              </li>
            </Link>
            <Link
              className={VALIDROUTE("/uplines") ? "Link-Active" : "Link"}
              to="/Uplines"
              style={{
                width: "240px !important",
                textDecoration: "none",
                color: "black",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <li
                style={{ color: VALIDROUTE("/uplines") ? "white" : null }}
                className="sidebaritems"
              >
                <span className="icon">
                  {!VALIDROUTE("/uplines") ? (
                    <img src={UplineIconDark} width="32" />
                  ) : (
                    <img src={UplineIcon} width="32" />
                  )}
                </span>
                Uplines
              </li>
            </Link>
            {/* <Link
              className={VALIDROUTE("/lostprofits") ? "Link-Active" : "Link"}
              to="/Lostprofits"
              style={{
                width: "240px !important",
                textDecoration: "none",
                color: "black",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <li
                style={{ color: VALIDROUTE("/lostprofits") ? "white" : null }}
                className="sidebaritems"
              >
                <span className="icon">
                  {!VALIDROUTE("/lostprofits") ? (
                    <img src="https://img.icons8.com/fluency-systems-filled/24/000000/search-dollar.png" />
                  ) : (
                    <img src="https://img.icons8.com/fluency-systems-filled/24/ffffff/search-dollar.png" />
                  )}
                </span>
                Lost profits
              </li>
            </Link> */}
            {/* <li
              style={{ color: VALIDROUTE("/promo") ? "white" : null }}
              className="sidebaritems"
            >
              <span className="icon">
                <IoIosSend size={24} />
              </span>
              promo
            </li> */}
          </ul>
        </div>
      </div>
      <Link
        onClick={Logout}
        className={"Link"}
        to="/"
        style={{
          width: "240px !important",
          textDecoration: "none",
          color: "black",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <li
          
          className="sidebaritems logoutItem"
        >
          Logout
        </li>
      </Link>
    </div>
  );
}
export default Sidenavbar;
