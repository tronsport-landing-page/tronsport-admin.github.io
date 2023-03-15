import React, { useEffect, useState } from "react";
import "./Uplines.css";
import Table from "./Table";
import Tree from "../Tree/Tree";
import Utils from "../../Utils/index";
import useWindowDimensions from "../../Tools/WindowDimensions";
import { Hex_to_base58 } from "../../Utils/Converter";
import TronWeb from "tronweb";
import { getPreviewModeId } from "../Redux/Reducer/PreviewMode";
import { useSelector } from "react-redux";

const FOUNDATION_ADDRESS = "TG31Eya5GywMYV2rwq3rwGbep4eoykWREP";

function Uplines() {
  const { height, width } = useWindowDimensions();
  const previewId = useSelector(getPreviewModeId);
  let walletId = previewId || window.tronLink.tronWeb.defaultAddress.base58;

  const [LoadingTable, setLoadingTable] = useState(true);

  const [tronWeb, settronWeb] = useState({ installed: false, loggedIn: false });
  const [data, setdata] = useState([]);

  useEffect(() => {
    CONNECT_WALLET();
  }, []);

  const FetchData = async (address) => {
    let temp_address = address;
    let TempArray = [];
    for await (const i of Array.from({ length: 5 }, (_, i) => i + 1)) {
      const id_to_num = await Utils.contract.users(temp_address).call();
      const data = await Promise.resolve(id_to_num);

      // const id = data[1].toNumber()
      const refId = data.referrerID.toNumber();

      const refererAddressPromise = await Utils.contract.userList(refId).call();
      const refererAddress = await Promise.resolve(refererAddressPromise);
      if (temp_address != (await Hex_to_base58(refererAddress.toString()))) {
        temp_address = await Hex_to_base58(refererAddress.toString());

        await currentLevel(temp_address).then((res) => {
          TempArray.push({
            id: refId,
            address: temp_address,
            currentLevel: res,
          });
          // console.log(temp_address);
          // setdata([{ id: refId, address: temp_address, currentLevel: res }]);
          // setLoadingTable(false);
        });
      }
    }

    if (TempArray.length > 1) {
      TempArray = TempArray.filter((e) => e.id != 0);
    }

    
    setdata(TempArray);
    setLoadingTable(false);

    return;
  };

  const currentLevel = async (address) => {
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

  // const ProccessTreeData = async (data, id, temp) => {
  // const id_to_num = await Utils.contract.users(id).call();
  // const resId = await Promise.resolve(id_to_num[1].toNumber());
  //   temp = {
  //     name: resId,
  //   };
  //   if (id in data) {
  //     const fetch = data[id].map(async (i) => {
  //       return ProccessTreeData(data, i, temp);
  //     });
  //     const response = await Promise.all(fetch);
  //     temp["children"] = response;
  //   } else {
  //     temp["name"] = resId;
  //   }

  //   console.log(temp);

  //   return temp;
  // };

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

      await Utils.setTronWeb(window.tronWeb).then(async () => {
        await FetchData(walletId, {}).then(async (e) => {});
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="Uplines">
      <div className="headerWrapper" >
        <p className="header">Uplines</p>
      </div>

      <Table LoadingTable={LoadingTable} data={data} />
    </div>
  );
}
export default Uplines;

// import React from "react";
// import "./Uplines.css";
// import { AiFillBell } from "react-icons/ai";
// import { FaSearch } from "react-icons/fa";
// import Table from "./Table";
// import Tree from "../Tree/Tree";
// function Uplines() {

//   return (
// <div className="Uplines">
//   <div>
//     <p className="header">Uplines</p>
//   </div>

//   <Table />
// </div>
//   );
// }
// export default Uplines;
