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

      if (!id_to_num) {
        setLoadingTable(false);
        break;
      }
      const data = await Promise.resolve(id_to_num);
      const refId = data?.referrerID?.toNumber();
      const refererAddressPromise = await Utils.contract.userList(refId).call();
      const refererAddress = await Hex_to_base58(refererAddressPromise);

      await currentLevel(refererAddress).then((res) => {
        setdata((e) => [
          ...e,
          {
            id: refId,
            address: refererAddress,
            currentLevel: res,
          },
        ]);
      });
      temp_address = refererAddress;

      if (LoadingTable) {
        setLoadingTable(false);
      }
      if (refId == 0) {
        break;
      }
    }

    if (TempArray.length > 1) {
      TempArray = TempArray.filter((e) => e.id != 0);
    }

    return;
  };

  const currentLevel = async (address) => {
    const checkLevelData = await Utils.contract
      .getUserCurrentLevel(address)
      .call();
    const checkLevel = await Promise.resolve(checkLevelData);
    return checkLevel?.toNumber();
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
      <div className="headerWrapper">
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
