import React, { useEffect, useState } from "react";
import "./Lostprofits.css";
import Table from "./Table";
import { AiFillBell } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import Utils from "../../Utils/index";
import useWindowDimensions from "../../Tools/WindowDimensions";
import { Hex_to_base58 } from "../../Utils/Converter";
import { getPartnersLevelJson } from "../Redux/Reducer/PartnersLevelJson";

import TronWeb from "tronweb";
import { useSelector } from "react-redux";
import { getPreviewModeId } from "../Redux/Reducer/PreviewMode";

const FOUNDATION_ADDRESS = "TG31Eya5GywMYV2rwq3rwGbep4eoykWREP";

function Lostprofits() {
  const { height, width } = useWindowDimensions();
  const previewId = useSelector(getPreviewModeId);
  let walletId = previewId || window.tronLink.tronWeb.defaultAddress.base58;

  const [LoadingTable, setLoadingTable] = useState(true);
  const [coinPrice, setcoinPrice] = useState(0);

  const [tronWeb, settronWeb] = useState({ installed: false, loggedIn: false });
  const [treeData, settreeData] = useState([]);
  const [TableData, setTableData] = useState([]);

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

  let TotalPartnersCount = 0;

  const FetchTree = async (id, TREEDATA) => {
    console.log(id, "HI");
    await Utils.contract
      .viewUserReferral(id)
      .call()
      .then(async (items) => {
        TotalPartnersCount += items.length;

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
        } else {
          return;
        }

        for await (const item of items) {
          let e = await Hex_to_base58(item);
          if (e == undefined || !e) return;
          await FetchTree(e, TREEDATA);
        }
      });

    return TREEDATA;
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

    console.log(temp);

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

  const FetchPayments = async (id) => {
    let ans = [];
    await Utils.contract
      .paymentsLength(id)
      .call()
      .then(async (length) => {
        setLoadingTable(false);

        for (let index = 0; index < length.toNumber(); index++) {
          let payment = await Utils.contract.lostProfit(id, index).call();
          let obj = {};
          obj.address = await Hex_to_base58(payment.payerAddress);
          obj.id = payment.referralId.toNumber();
          obj.coins = payment.loss.toNumber() / 1000000;
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

      await FetchPayments(walletId);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="Lostprofits">
      <div className="headerWrapper">
        <p className="header">Lostprofits</p>
      </div>

      <Table
        LoadingTable={LoadingTable}
        data={TableData}
        coinprice={coinPrice}
      />
    </div>
  );
}
export default Lostprofits;
