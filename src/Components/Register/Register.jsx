import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import "../Login/Login.css";
import { GrSend } from "react-icons/gr";
import { FiTwitter } from "react-icons/fi";
import { BsInstagram } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsBoxArrowUpRight } from "react-icons/bs";

import Logo from "../../Assets/logo.svg";
import { Form, Button } from "react-bootstrap";
import ConnectWallet from "../Wallets/ConnectWallet";
import useWindowDimensions from "../../Tools/WindowDimensions";
import { FaBullseye } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import TronWeb from "tronweb";
import Utils from "../../Utils/index";
import { getAuth, toogleAuth } from "../Redux/Reducer/AuthReducer";
import { toogleuserId } from "../Redux/Reducer/UserId";

const Register = () => {
  const { height, width } = useWindowDimensions();

  const [Register, setRegister] = useState(FaBullseye);

  const [loginId, setloginId] = useState("");
  const [refId, setrefId] = useState(null);
  const [alertdata, setalertdata] = useState(null);
  const [Loader, setLoader] = useState(false);


  const BUY_AMOUNT = 3;

  const FOUNDATION_ADDRESS = "TG31Eya5GywMYV2rwq3rwGbep4eoykWREP";

  const authStatus = useSelector(getAuth);
  const dispatch = useDispatch();

  const [tronWeb, settronWeb] = useState({ installed: false, loggedIn: false });

  let TOKEN = localStorage.getItem("access_token");

  // const Login =()=>{
  //   window.location = "http://console.localhost:3000/"
  // }

  let id = window?.tronLink?.tronWeb?.defaultAddress?.base58;

  useEffect(() => {
    document.title = "Smart Genie|Register";
    if (window.location?.pathname?.split("/")[2]) {
      setrefId(window.location?.pathname?.split("/")[2]);
    }
  }, []);

  const HandleSubmit = async (e) => {
    e.preventDefault();
  };

  const CONNECT_WALLET = async () => {
    try {
      // if (!window.tronWeb.ready) {
      //   window.location.href = "/";
      // }

      new Promise((resolve) => {
        const tronWebState = {
          installed: !!window.tronWeb,
          loggedIn: window.tronWeb && window.tronWeb.ready,
        };

        if (tronWebState.installed) {
          settronWeb(tronWebState);

          return resolve();
        }

        let tries = 0;

        const timer = setInterval(() => {
          if (tries >= 10) {
            const TRONGRID_API = "https://api.trongrid.io";

            window.tronWeb = new TronWeb(
              TRONGRID_API,
              TRONGRID_API,
              TRONGRID_API
            );

            settronWeb({
              installed: false,
              loggedIn: false,
            });

            clearInterval(timer);
            return resolve();
          }

          tronWebState.installed = !!window.tronWeb;
          tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

          if (!tronWebState.installed) return tries++;

          settronWeb(tronWebState);

          resolve();
        }, 100);
      });

      window.tronWeb.defaultAddress = {
        hex: window.tronWeb?.address?.toHex(id),
        base58: id,
      };

      window.tronWeb.on("addressChanged", (e) => {
        if (tronWeb.loggedIn) return;

        settronWeb({
          tronWeb: {
            installed: true,
            loggedIn: true,
          },
        });
      });

      await Utils.setTronWeb(window.tronWeb).then(async () => {
        if (refId != null) {
          // if (JSON.parse(refId) <= 9) {
          //   let CurrentIdLoad = await Utils.contract.currUserID().call();
          //   let CurrentId = await Promise.resolve(CurrentIdLoad);
          //   await Buy(JSON.parse(CurrentId.toString()));
          // } else {
          //   await Buy(refId);
          // }
          await Buy(refId);

        } else {
          let CurrentIdLoad = await Utils.contract.currUserID().call();
          let CurrentId = await Promise.resolve(CurrentIdLoad);
          await Buy(JSON.parse(CurrentId.toString()));
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const Buy = async (refID) => {
    window.tronWeb.defaultAddress = {
      hex: window.tronWeb?.address?.toHex(id),
      base58: id,
    };

    return await Utils.setTronWeb(window.tronWeb).then(async () => {
      const toastId = toast.loading("Waiting for transaction confirmation");
      setLoader(true);
      try {
        await Utils.contract
          .regUser(refID)
          .send({
            feeLimit: 100_000_000,
            callValue: 1000000 * BUY_AMOUNT,
            shouldPollResponse: true,
          })
          .then(async (res) => {
            toast.remove(toastId);
            toast.success("Transaction done successfully");
            await FetchUserId(id);
            dispatch(toogleAuth("LOGGEDIN"));

            return res;
          })
          .catch(async (err) => {
            await checkUser(toastId);
            console.log(err);
          });
      } catch (error) {
        console.log(error);
        await checkUser(toastId);
      }
    });
  };

  const checkUser = async (toastId) => {
    console.log(window.tronWeb);
    await Utils.setTronWeb(window.tronWeb).then(async () => {
      const LoadUserExist = await Utils.contract.users(id).call();
      const userexist = await Promise.resolve(LoadUserExist);
      if (userexist.isExist == true) {
        toast.remove(toastId);
        toast.success("Transaction done successfully");
        setLoader(false);
        await FetchUserId(id);
        dispatch(toogleAuth("LOGGEDIN"));
        window.location.href = "/";
      } else {
        // window.location.href = "/register";
        dispatch(toogleAuth("LOGGEDOUT"));

        setLoader(false);
        toast.remove(toastId);
        toast.error("Transaction Failed");
      }

      // console.log(userexist[0]);
    });
  };

  const FetchUserId = async (userAddress) => {
    const LoadUserId = await Utils.contract.users(userAddress).call();
    const userId = await Promise.resolve(LoadUserId);
    // alert(userId.id.toNumber(),"hi")
    dispatch(toogleuserId(userId.id.toNumber()));
  };

  return (
    <div className="Login-Main">
      <div className={"Inside"}>
        <div className="Logo-Div">
          <img src={Logo} />
        </div>

        <div style={{ paddingInline: "20px" ,marginTop:"45px"}} className="Divider">
          Register
        </div>
        <div className="Inside-Form-Div">
          <Form onSubmit={(e) => HandleSubmit(e)}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                name="email"
                className="Input"
                placeholder="Enter Referal Id of Upline (Optional)"
                value={refId}
                onChange={(e) => {
                  setrefId(e.target.value);
                }}
                required={false}
              />
            </Form.Group>

            <div className="Button-Div">
              <button
                onClick={CONNECT_WALLET}
                disabled={Loader}
                style={{ opacity: Loader ? 0.5 : 1 }}
                className="Button"
              >
                {Loader ? (
                  <p>Transction Loading...</p>
                ) : (
                  <p>Purchase Level 1 for 300TRX</p>
                )}
              </button>
            </div>

            <div className="Back-Button-Div">
              <Link to={"/"} style={{ textDecoration: "none" }}>
                <button className="Back-Button">Back</button>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
