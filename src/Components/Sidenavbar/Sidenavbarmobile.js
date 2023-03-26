import React, { useState } from "react";
import "./Sidenavbar.css";
import { FaUserCircle } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { FaNetworkWired } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaSearchDollar } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { BsBoxArrowRight } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import { toogleMenu, getTooglemenu } from "../Redux/Reducer/MenuReducer";
import { toogleAuth } from "../Redux/Reducer/AuthReducer";

import { ReactComponent as Logo } from "../../Assets/logo.svg";
import WalletIcon from "../../Assets/wallet.svg";
import WalletIconDark from "../../Assets/wallet-dark.svg";
import TreeIcon from "../../Assets/tree.svg";
import TreeIconDark from "../../Assets/tree-dark.svg";
import UplineIcon from "../../Assets/upline.svg";
import UplineIconDark from "../../Assets/upline-dark.svg";
import BurnIcon from "../../Assets/burn.svg";
import BurnIconDark from "../../Assets/burn-dark.svg";

function Sidenavbarmobile() {
  const [openMenu, setopenMenu] = useState(false);

  const menu = useSelector(getTooglemenu);
  const dispatch = useDispatch();

  const location = useLocation();

  const PATHNAME = () => location?.pathname?.toLowerCase();

  const VALIDROUTE = (path) => (PATHNAME(path) == path ? true : false);

  const Logout = () => {
    window.tronLink.tronWeb = false;
    dispatch(toogleAuth("LOGGEDOUT"));
  };

  return (
    <Offcanvas show={menu} onHide={() => dispatch(toogleMenu(!menu))}>
      <Offcanvas.Header closeButton>
        <Logo className="logoimg" />
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div style={{ width: "100%" }} className="sidenav">
          <div className="sidebarcontainer">
            <div className="menu">
              <ul className="sidebarlist">
                <Link
                  className={VALIDROUTE("/") ? "Link-Active" : "Link"}
                  onClick={() => dispatch(toogleMenu(!menu))}
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
                  onClick={() => dispatch(toogleMenu(!menu))}
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
                  onClick={() => dispatch(toogleMenu(!menu))}
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
                <Link
                  className={
                    VALIDROUTE("/lostprofits") ? "Link-Active" : "Link"
                  }
                  onClick={() => dispatch(toogleMenu(!menu))}
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
                    style={{
                      color: VALIDROUTE("/lostprofits") ? "white" : null,
                    }}
                    className="sidebaritems"
                  >
                    <span className="icon">
                      {!VALIDROUTE("/lostprofits") ? (
                        <img
                          style={{ marginLeft: "3px" }}
                          width="22"
                          src={BurnIconDark}
                        />
                      ) : (
                        <img
                          style={{ marginLeft: "3px" }}
                          width="22"
                          src={BurnIcon}
                        />
                      )}
                    </span>
                    Lost profits
                  </li>
                </Link>
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
            className={"Link"}
            onClick={() => {Logout();dispatch(toogleMenu(!menu))}}
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
            <li className="sidebaritems logoutItem">Logout</li>
          </Link>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
export default Sidenavbarmobile;
