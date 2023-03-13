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

const FOUNDATION_ADDRESS = "TG31Eya5GywMYV2rwq3rwGbep4eoykWREP";

function Partners() {
  const { height, width } = useWindowDimensions();
  const previewId = useSelector(getPreviewModeId);
  let walletId = previewId || window.tronLink.tronWeb.defaultAddress.base58;

  const [coinPrice, setcoinPrice] = useState(0);
  const [searchId, setsearchId] = useState("");

  const [LoadingStruct, setLoadingStruct] = useState(true);
  const [LoadingTable, setLoadingTable] = useState(true);

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


  const FetchTree = async (id, TREEDATA) => {
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


    return temp;
    // if(data[0]?.children){
    //   ProccessTreeData(data[0]?.children)
    // }
    // return ans
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

  const calculate_CoinsFromLevels = async (data) => {
    let TempData = [];

    let LEVEL1 = data["1"];
    let LEVEL2 = data["2"];
    let LEVEL3 = data["3"];
    let LEVEL4 = data["4"];
    let LEVEL5 = data["5"];

    if (LEVEL1 != undefined) {
      let Totalcoins = 0;
      let tempArray = [];

      for await (const id of LEVEL1) {
        // LEVEL 1
        // temp["address"] = id;

        let expiration0 = (
          await Utils.contract.viewUserLevelExpired(id, 1).call()
        ).toNumber();

        if (expiration0 != 0) {
          Totalcoins +=
            (await Utils.contract.LEVEL_PRICE(1).call()).toNumber() / 1000000;

          tempArray.push({ address: id, coins: Totalcoins });
          Totalcoins = 0;
        }

        // LEVEL 6
        let expiration01 = (
          await Utils.contract.viewUserLevelExpired(id, 6).call()
        ).toNumber();

        if (expiration01 != 0) {
          Totalcoins +=
            (await Utils.contract.LEVEL_PRICE(6).call()).toNumber() / 1000000;
          tempArray.push({ address: id, coins: Totalcoins });
          Totalcoins = 0;
        }
      }

      TempData = [...TempData, ...tempArray];
    }

    if (LEVEL2 != undefined) {
      let Totalcoins = 0;
      let tempArray = [];

      for await (const id of LEVEL2) {
        let expiration1 = (
          await Utils.contract.viewUserLevelExpired(id, 2).call()
        ).toNumber();

        if (expiration1 != 0) {
          Totalcoins +=
            (await Utils.contract.LEVEL_PRICE(2).call()).toNumber() / 1000000;
          tempArray.push({ address: id, coins: Totalcoins });
          Totalcoins = 0;
        }

        // LEVEL 6
        let expiration2 = (
          await Utils.contract.viewUserLevelExpired(id, 7).call()
        ).toNumber();

        if (expiration2 != 0) {
          Totalcoins +=
            (await Utils.contract.LEVEL_PRICE(7).call()).toNumber() / 1000000;
          tempArray.push({ address: id, coins: Totalcoins });
          Totalcoins = 0;
        }
      }
      TempData = [...TempData, ...tempArray];
    }

    if (LEVEL3 != undefined) {
      let Totalcoins = 0;
      let tempArray = [];

      for await (const id of LEVEL3) {
        // LEVEL 2

        let expiration3 = (
          await Utils.contract.viewUserLevelExpired(id, 3).call()
        ).toNumber();

        if (expiration3 != 0) {
          Totalcoins +=
            (await Utils.contract.LEVEL_PRICE(3).call()).toNumber() / 1000000;
          tempArray.push({ address: id, coins: Totalcoins });
          Totalcoins = 0;
        }

        // LEVEL 7
        let expiration4 = (
          await Utils.contract.viewUserLevelExpired(id, 8).call()
        ).toNumber();

        if (expiration4 != 0) {
          Totalcoins +=
            (await Utils.contract.LEVEL_PRICE(8).call()).toNumber() / 1000000;
          tempArray.push({ address: id, coins: Totalcoins });
          Totalcoins = 0;
        }
      }
      TempData = [...TempData, ...tempArray];
    }

    if (LEVEL4 != undefined) {
      let Totalcoins = 0;
      let tempArray = [];

      for await (const id of LEVEL4) {
        // LEVEL 3

        let expiration5 = (
          await Utils.contract.viewUserLevelExpired(id, 4).call()
        ).toNumber();

        if (expiration5 != 0) {
          Totalcoins +=
            (await Utils.contract.LEVEL_PRICE(4).call()).toNumber() / 1000000;
          tempArray.push({ address: id, coins: Totalcoins });
          Totalcoins = 0;
        }

        // LEVEL 8

        let expiration6 = (
          await Utils.contract.viewUserLevelExpired(id, 9).call()
        ).toNumber();

        if (expiration6 != 0) {
          Totalcoins +=
            (await Utils.contract.LEVEL_PRICE(9).call()).toNumber() / 1000000;
          tempArray.push({ address: id, coins: Totalcoins });
          Totalcoins = 0;
        }
      }
      TempData = [...TempData, ...tempArray];

      if (LEVEL5 != undefined) {
        let Totalcoins = 0;
        let tempArray = [];

        for await (const id of LEVEL5) {
          // LEVEL 4
          let expiration7 = (
            await Utils.contract.viewUserLevelExpired(id, 5).call()
          ).toNumber();

          if (expiration7 != 0) {
            Totalcoins +=
              (await Utils.contract.LEVEL_PRICE(5).call()).toNumber() / 1000000;
            tempArray.push({ address: id, coins: Totalcoins });
            Totalcoins = 0;
          }

          // LEVEL 9
          let expiration8 = (
            await Utils.contract.viewUserLevelExpired(id, 10).call()
          ).toNumber();

          if (expiration8 != 0) {
            Totalcoins +=
              (await Utils.contract.LEVEL_PRICE(10).call()).toNumber() /
              1000000;
            tempArray.push({ address: id, coins: Totalcoins });
            Totalcoins = 0;
          }
        }
        TempData = [...TempData, ...tempArray];
      }

      // setcoinsCount(Totalcoins);
    }
    return TempData;
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

  const FetchPayments = async (id, count) => {
    ++LEVEL;

    // console.log(count, PartnersArray.length)

    if (count == PartnersArray.length) {
      
      return await calculate_CoinsFromLevels(LevelJSON).then(async (res) => {
        return await PreProcessData(res).then((result) => {


          setTableData(result);
          setLoadingTable(false);
        });
      });
      // return;
    } else {
      await Utils.contract
        .viewUserReferral(id)
        .call()
        .then(async (items) => {
          PartnersArray = [...PartnersArray, ...items];

          if (LEVEL == 1) {
            LevelJSON[`${LEVEL}`] = await ConverttoHexArray(items);
          } else if (LEVEL == 2) {
            LevelJSON[`${LEVEL}`] = await ConverttoHexArray(items);
          } else if (LEVEL == 3) {
            LevelJSON[`${LEVEL}`] = await ConverttoHexArray(items);
          } else if (LEVEL == 4) {
            LevelJSON[`${LEVEL}`] = await ConverttoHexArray(items);
          } else if (LEVEL == 5) {
            LevelJSON[`${LEVEL}`] = await ConverttoHexArray(items);
          }

          if (items.length > 0) {
            for await (const item of items) {
              let e = await Hex_to_base58(item);
              if (e == undefined || !e) return;

              await FetchPayments(e, count);
            }
          }
        });
    }
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
      return await Utils.setTronWeb(window.tronWeb).then(async () => {
        return await FetchTree(walletId, {}).then(async (e) => {
          return await ProccessTreeData(e, walletId, {}).then(async (res) => {
            settreeData([res]);
            setLoadingStruct(false);

            return await FetchPartners(walletId,[]).then(async(TotalPartnersCount)=>{
              // console.log(TotalPartnersCount);
              return await FetchPayments(walletId, TotalPartnersCount.length);

            })

          });
        });
      });
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
    } catch (e) {
      console.log(e);
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
      <div>
        <p className="header">Partners</p>
      </div>

      <div className="linkbox">
        <div className="linkInside">
          <div className="content">
            <p className="linkname1">Your Affilate Link</p>
            <br />

            <input
              className="link1"
              readOnly={true}
              value={`${window.location.origin}/register/${userID}`}
            />
            <br />
            <button onClick={copyLink} className="copybtn">
              Copy Link
            </button>
          </div>
        </div>

        <div
          style={{
            marginLeft: width >= 1100 ? "30px" : "0",
            marginTop: width >= 1100 ? "0" : "20px",
          }}
          className="linkInside"
        >
          <div className="content">
            {width >= 1100 ? (
              <>
                <p className="linkname1">Data about partner</p>
                <br />
                <div className="Inline">
                  <input
                    placeholder="Enter Id or Address"
                    value={searchId}
                    onChange={(e) => setsearchId(e.target.value)}
                    className={"link2"}
                  />
                  <span>
                    <button
                      onClick={() => SearchAboutPartner()}
                      className="copybtn"
                    >
                      Search
                    </button>
                  </span>
                </div>
              </>
            ) : (
              <div style={{ width: "100%" }}>
                <p className="linkname1">Data about partner</p>
                <br />
                <input
                  placeholder="Enter Id or Address"
                  value={searchId}
                  onChange={(e) => setsearchId(e.target.value)}
                  style={{ width: "100%" }}
                  className={"link1"}
                />
                <span>
                  <button
                    onClick={() => SearchAboutPartner()}
                    style={{ marginTop: "10px" }}
                    className="copybtn"
                  >
                    Search
                  </button>
                </span>
              </div>
            )}

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
