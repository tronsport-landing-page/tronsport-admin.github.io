import React, { useEffect, useState } from "react";
import "./Partners.css";
import { AiFillBell } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import Table from "../Table/Table";
import Tree from "../Tree/Tree";
import Utils from "../../Utils/index";
import useWindowDimensions from "../../Tools/WindowDimensions";
import { Hex_to_base58 } from "../../Utils/Converter";
import { getPartnersLevelJson } from "../Redux/Reducer/PartnersLevelJson";
import toast, { Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";

import TronWeb from "tronweb";
import { useSelector } from "react-redux";
import { getPreviewModeId } from "../Redux/Reducer/PreviewMode";
import { Spinner } from "react-bootstrap";
import { getuserId } from "../Redux/Reducer/UserId";

import successIcon from "../../Assets/success.svg";

const FOUNDATION_ADDRESS = "TG31Eya5GywMYV2rwq3rwGbep4eoykWREP";

function Partners() {
  const { height, width } = useWindowDimensions();
  const previewId = useSelector(getPreviewModeId);
  let walletId = previewId || window.tronLink.tronWeb.defaultAddress.base58;

  const [coinPrice, setcoinPrice] = useState(0);
  const [searchId, setsearchId] = useState("");

  const [LoadingStruct, setLoadingStruct] = useState(true);
  const [LoadingTable, setLoadingTable] = useState(true);
  const [searchLoader, setsearchLoader] = useState(false);

  const [searchPartnerData, setsearchPartnerData] = useState({});

  const [tronWeb, settronWeb] = useState({ installed: false, loggedIn: false });
  const [treeData, settreeData] = useState([]);
  const [TableData, setTableData] = useState([]);
  const userID = useSelector(getuserId);

  // const levelJson = useSelector(getPartnersLevelJson);

  useEffect(() => {
    CONNECT_WALLET();
    FetchCoinCurrecy();
  }, []);

  const FetchCoinCurrecy = async () => {
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd&include_market_cap=true`
    )
      .then((res) => res.json())
      .then((data) => {
        setcoinPrice(data.tron.usd);
      });
  };

  const FetchTree = async (id) => {
    let TREEDATA = {};
    await Utils.contract
      .viewUserReferral(id)
      .call()
      .then(async (items) => {
        var item = {};

        if (items.length > 0) {
          var temp = [];
          for await (const item of items) {
            let e = await Hex_to_base58(item);
            temp.push(e);
          }

          item = {
            name: id,
            children: temp,
          };
          TREEDATA[`${id}`] = temp;
        }

        await ProccessTreeData(TREEDATA, walletId, {}).then(async (res) => {
          settreeData([res]);
          setLoadingStruct(false);
        });
      });
  };

  const ProccessTreeData = async (data, id, temp) => {
    const id_to_num = await Utils.contract.users(id).call();
    const resId = await Promise.resolve(id_to_num.id.toNumber());

    temp = {
      name: resId,
    };
    if (id in data) {
      const fetch = data[id].map(async (i) => {
        return ProccessTreeData(data, i, temp);
      });
      const response = await Promise.all(fetch);
      temp["children"] = response;
    } else {
      temp["name"] = resId;
    }

    return temp;
  };

  let PartnersArray = [];
  let LevelJSON = {};

  var LEVEL = 0;

  const ConverttoHexArray = async (items) => {
    let temp = [];
    for await (const i of items) {
      let t = await Hex_to_base58(i);
      temp.push(t);
    }
    return temp;
  };

  

  const PreProcessData = async (data) => {
    let temp = [];
    for await (const item of data) {
      const id_to_num = await Utils.contract.users(item.address).call();
      const data = await Promise.resolve(id_to_num);

      const id = data.id.toNumber();
      temp.push({ address: item.address, id: id, coins: item.coins });
    }
    return temp;
  };

  const FetchPayments = async (id) => {
    let ans = [];
    await Utils.contract
      .paymentsLength(id)
      .call()
      .then(async (length) => {
        setLoadingTable(false);

        for (let index = 0; index < length.toNumber(); index++) {
          let payment = await Utils.contract.payments(id, index).call();
          let obj = {};
          obj.address = await Hex_to_base58(payment.payerAddress);
          obj.id = payment.payerId.toNumber();
          obj.coins = payment.amount.toNumber() / 1000000;
          ans.push(obj);
          setTableData((e) => [...e, obj]);
        }
      });
  };
  

  const CONNECT_WALLET = async () => {
    try {
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

      if (!tronWeb.loggedIn) {
        // Set default address (foundation address) used for contract calls
        // Directly overwrites the address object as TronLink disabled the
        // function call
        window.tronWeb.defaultAddress = {
          hex: window.tronWeb?.address?.toHex(walletId),
          base58: walletId,
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
      }

      await FetchTree(walletId).then(async ()=>{
        await FetchPayments(walletId)
      })
    } catch (e) {
      CONNECT_WALLET();
      console.log(e);
    }
  };

  const FetchPartners = async (id, partners) => {
    // console.log(id);
    return await Utils.contract
      .viewUserReferral(id)
      .call()
      .then(async (items) => {
        for await (const item of items) {
          let e = await Hex_to_base58(item);
          if (e == undefined || !e) return;
          partners.push(e);
          await FetchPartners(e, partners);
        }
        return partners;
      });
  };

  const SearchAboutPartner = async () => {
    try {
      setsearchLoader(true);
      if (searchId.trim().length == 0) {
        return toast.error("Please enter valid RefId/address", {
          style: { marginTop: "70px" },
        });
      }

      // if string is address
      if (/[a-zA-Z]/.test(searchId)) {
        const LoadUserExist = await Utils.contract.users(searchId).call();
        const userexist = await Promise.resolve(LoadUserExist);
        if (userexist.isExist == false) {
          return toast.error("User does not exist");
        }
        const currentLevel = await getcurrentLevel(searchId);

        setsearchPartnerData({
          id: userexist.id.toString(),
          address: searchId,
          level: currentLevel,
        });

        // console.log(userexist[0]);
      } else {
        const LoadUserAddress = await Utils.contract
          .userList(JSON.parse(searchId))
          .call();
        const userAddress = await Promise.resolve(LoadUserAddress);

        const LoadUserExist = await Utils.contract.users(userAddress).call();
        const userexist = await Promise.resolve(LoadUserExist);
        if (userexist.isExist == false) {
          return toast.error("User does not exist", {
            style: { marginTop: "70px" },
          });
        }
        const currentLevel = await getcurrentLevel(userAddress);
        setsearchPartnerData({
          id: userexist.id.toString(),
          address: await Hex_to_base58(userAddress),
          level: currentLevel,
        });
      }
      setsearchLoader(false);
    } catch (e) {
      console.log(e);
      setsearchLoader(false);
    }
  };

  const getcurrentLevel = async (address) => {
    let currentLevel = 0;
    for await (const level of Array.from({ length: 10 }, (_, i) => i + 1)) {
      const checkLevel = await Utils.contract
        .viewUserLevelExpired(address, level)
        .call();
      const currentTimestamp = await Promise.resolve(checkLevel);
      if (
        currentTimestamp.toNumber() < Date.now() &&
        currentTimestamp.toNumber() != 0
      ) {
        ++currentLevel;
      }
    }
    return currentLevel;
  };

  const copyLink = () => {
    try {
      copy(`${window.location.origin}/register/${userID}`);
      // navigator.clipboard.writeText(`${window.location.origin}/register/${userID}`);
      toast.success("Copied to clipboard", { style: { marginTop: "65px" } });
    } catch (e) {
      toast.error("Failed to Copy to clipboard", {
        style: { marginTop: "65px" },
      });
      // window.clipboardData.setData("Text", 'Copy this text to clipboard')

      console.log(e);
    }
  };

  return (
    <div className="panel">
      <Toaster />
      <div className="headerWrapper">
        <p className="header">Partners</p>
      </div>

      <div className="linkbox">
        <div className="linkInside">
          <div className="content">
            <p className="linkname1">Your Affilate Link</p>
            <br />

            <div className="link1">
              <img alt="" width="25" height="25" src={successIcon} />
              <input
                readOnly={true}
                value={`${window.location.origin}/register/${userID}`}
              />
              <br />
              <button onClick={copyLink} className="copybtn">
                Copy Link
              </button>
            </div>
          </div>
        </div>

        <div className="linkInside">
          <div className="content">
            <>
              <p className="linkname1">Data about partner</p>
              <br />
              <div className="link1">
                <img alt="" width="25" height="25" src={successIcon} />
                <input
                  placeholder="Enter Id or Address"
                  value={searchId}
                  onChange={(e) => setsearchId(e.target.value)}
                  className={"link2"}
                />
                <br />
                <button
                  onClick={() => SearchAboutPartner()}
                  className="copybtn"
                >
                  {searchLoader ? "Searching" : "Search"}
                </button>
              </div>
            </>

            <br />
            <div className="PartnerList">
              {searchPartnerData?.id && (
                <div class="partner__info">
                  ID: <b>{searchPartnerData?.id}</b> &nbsp;&nbsp;&nbsp; Level:{" "}
                  <b>{searchPartnerData?.level}</b> &nbsp;&nbsp;&nbsp; Address:
                  {searchPartnerData?.address}{" "}
                  <a
                    href="https://etherscan.io/address/0xa7d7043df066a9fd0fc277a1d48bc07d43714557 "
                    target="_blank"
                  >
                    <i class="fa fa-external-link-alt"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="structure">
        <p className="linkname1">Your structure</p>
        {/* <a href="#">To expand\collapse all</a> */}
        <div className="TreeDiv">
          {!LoadingStruct ? (
            <Tree data={treeData} />
          ) : (
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
        {!LoadingTable ? (
          <Table data={TableData} coinprice={coinPrice} />
        ) : (
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
  );
}
export default Partners;
