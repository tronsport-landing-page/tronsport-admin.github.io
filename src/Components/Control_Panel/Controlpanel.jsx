import React, { useEffect, useState } from "react";
import "./Controlpanel.css";
import Chart from "./Chart";
import Slidecontent from "./Slidecontent";
import Chart2 from "./chart2";
import { AiFillBell, AiFillFileExclamation } from "react-icons/ai";
import ScrollToTop from "../../Tools/ScrollToTop";
import useWindowDimensions from "../../Tools/WindowDimensions";
import Utils from "../../Utils/index";
import { Hex_to_base58 } from "../../Utils/Converter";
import TronWeb from "tronweb";
import CountUp from "react-countup";
import moment from "moment";
import "./Levels.css";
import toast, { Toaster } from "react-hot-toast";
import { getPreviewModeId } from "../Redux/Reducer/PreviewMode";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

import Pocket1Icon from "../../Assets/pocket1.svg";
import Pocket2Icon from "../../Assets/pocket2.svg";
import Pocket3Icon from "../../Assets/pocket3.svg";
import Pocket4Icon from "../../Assets/pocket4.svg";

const TEMP_ADDRESS = "TJrQX9SeYDPKVy9eKEViWGqDL2wFGUBaNJ";



function Controlpanel() {
  const { height, width } = useWindowDimensions();
  const previewId = useSelector(getPreviewModeId);
  let id = previewId || window.tronLink.tronWeb.defaultAddress.base58;

  const [directPartners, setdirectPartners] = useState(0);
  const [indirectPartners, setindirectPartners] = useState(0);

  const [coinsCount, setcoinsCount] = useState(0);
  const [coinPrice, setcoinPrice] = useState(0);
  const [chartData, setchartData] = useState({ labels: [], data: [] });
  const [currentLevel, setcurrentLevel] = useState(0);
  const [expiredDate, setexpiredDate] = useState([]);

  const [FOUNDATION_ADDRESS, setFOUNDATION_ADDRESS] = useState(TEMP_ADDRESS);
  const [LoadingLevels, setLoadingLevels] = useState(true);
  const LEVEL_PRICE = [200, 1000, 5000];

  let Total = 0;

  let partners = [];

  const [tronWeb, settronWeb] = useState({ installed: false, loggedIn: false });

  useEffect(() => {
    CONNECT_WALLET();
    FetchCoinCurrecy();
  }, []);

  const FetchCoinCurrecy = async () => {
    try {
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd&include_market_cap=true`
      )
        .then((res) => res.json())
        .then((data) => {
          setcoinPrice(data?.tron?.usd);
        });
    } catch (error) {
      // alert("ERROR")
    }
  };

  const ProccessRefralGraphData = async (data) => {
    let labels = [];
    let graphData = [];
    let Temp = {};

    for await (const address of data) {
      const joinedData = await Utils.contract.users(address).call();
      // console.log(joinedData);

      let joined = await Promise.resolve(joinedData.joined.toNumber());

      joined = moment.unix(joined).format("DD/MM/YYYY");
      if (Temp[`${joined}`] != undefined) {
        Temp[`${joined}`] = Temp[`${joined}`] + 1;
      } else {
        Temp[`${joined}`] = 1;
      }
    }

    let SortedObject = Object.fromEntries(
      Object.entries(Temp).sort(function (a, b) {
        var aa = a[0].split("/").reverse().join(),
          bb = b[0].split("/").reverse().join();
        return aa < bb ? -1 : aa > bb ? 1 : 0;
      })
    );

    for await (const [key, value] of Object.entries(SortedObject)) {
      labels.push(key);
      graphData.push(value);
    }

    let resData = {
      labels: labels,
      data: graphData,
    };

    console.log(labels, graphData);

    return resData;
  };

  const FetchData = async () => {
    try {
      Promise.all([Utils.contract.users(id).call(), FetchLevel(id)]).then(
        async (values) => {
          let userData = values[0];
          let earning = userData.earning.toNumber() / 1000000;
          let directReferralCount =
            userData?.directReferralCount?.toNumber() || 0;
          let indirectReferralCount =
            userData?.indirectReferralCount?.toNumber() || 0;

          let indirectReferralLength =
            userData?.indirectReferralLength?.toNumber() || 0;


          setcoinsCount(earning);
          setdirectPartners(directReferralCount);
          setindirectPartners(indirectReferralCount);
          setLoadingLevels(false);

          await GetChartData(id, indirectReferralLength);
        }
      );
    } catch (e) {
      // console.log(e);
      setLoadingLevels(false);
    }
  };

  const GetChartData = (id, indirectCount) => {

    Promise.all([Utils.contract.viewUserReferral(id).call(), indirectPartnersFetch(indirectCount)]).then(async([directPartners, indirectPartners]) => {
      let items = [...directPartners, ...indirectPartners];
      let newArray = [];
      for await (let item of items) {
        let x = await Hex_to_base58(item);
        newArray.push(x);
      }
      await ProccessRefralGraphData(newArray).then(async (res) => {
        setchartData(res);
      });
    })


  };

  const indirectPartnersFetch = async (indirectCount) => {
    let indirectPartnersList = [];

    var TempindirectPartnersList = Array.from(Array(indirectCount), (_, index) => index);

    for await (let index of TempindirectPartnersList) {
      let partnerAddress = await Utils.contract
        .viewUserIndirectReferral(id, index)
        .call();
      // console.log(partnerAddress);
      indirectPartnersList.push(partnerAddress);
    }

    return indirectPartnersList
  }




  const FetchLevel = async (id) => {

    // UTILITY FUNCTION
    const convert = (x, canActivate, canExtend) => {
      let data = { active: false, expires: 0, canActivate: canActivate, canExtend: canExtend }

      if (x == 0) {
        return data
      }

      data.expires = Math.round(
        (new Date(x * 1000).getTime() -
          new Date(Date.now()).getTime()) /
        (1000 * 60 * 60 * 24),
        0
      )

      if (new Date(x * 1000).getTime() <= new Date(Date.now()).getTime()) {
        data.active = false
      } else {
        data.active = true
      }
      return data
    }

    Promise.all([Utils.contract.getUserCurrentLevel(id).call(), Utils.contract.getUserLevelsData(id).call()]).then(([currentLevel, levelsData]) => {
      setcurrentLevel(currentLevel.toNumber() || 0)
      let [level1, level2, level3, canActivate2, canActivate3, canExtend3] = levelsData;
      setLevelsData([convert(level1.toNumber(), true, true), convert(level2.toNumber(), canActivate2, canActivate2), convert(level3.toNumber(), canActivate3, canExtend3)]);
    })
  };

  const getcurrentLevel = async (address) => {
    let currentLevel = 0;
    for await (const level of Array.from({ length: 3 }, (_, i) => i + 1)) {
      const checkLevel = await Utils.contract
        .viewUserLevelExpired(address, level)
        .call();
      const currentTimestamp = await Promise.resolve(checkLevel);

      if (
        currentTimestamp.toNumber() * 1000 > Date.now() &&
        currentTimestamp.toNumber() * 1000 != 0
      ) {
        ++currentLevel;
      }
    }
    setcurrentLevel(currentLevel);
    return currentLevel;
  };



  const ConverttoHexArray = async (items) => {
    let temp = [];
    for await (const i of items) {
      let t = await Hex_to_base58(i);
      temp.push(t);
    }
    return temp;
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

      window.tronWeb.on("addressChanged", (e) => {
        if (tronWeb.loggedIn) return;

        settronWeb({
          tronWeb: {
            installed: true,
            loggedIn: true,
          },
        });
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
        try {
          await FetchData();
        } catch (error) {
          // console.log(error);
        }
      });
    } catch (e) {
      CONNECT_WALLET();
      // console.log(e);
    }
  };

  const [LevelsData, setLevelsData] = useState([{ expires: 0, active: false, canActivate: false, canExtend: false }]);


  const checkCriteria = (level) => {
    var isActive = LevelsData[level - 1]?.active
    var isExtendable = LevelsData[level - 1]?.canExtend
    var canActivate = LevelsData[level - 1]?.canActivate

    // if(!canActivate)



    if (level == 2) {
      if (isActive) {
        if (!isExtendable) {
          toast.error(
            `Level 2 can be only Extended:- \n 1) After 40 days of Purchase of Level 1 \n 2) Minimum 5 Direct Referals \n 3) Previous Levels must be Active`,
            { position: "bottom-center" }
          );
          return false
        }
      } else {
        if (!canActivate) {
          toast.error(
            `Level 2 can be only Activated:- \n 1) After 40 days of Purchase of Level 1 \n 2) Minimum 5 Direct Referals \n 3) Previous Levels must be Active`,
            { position: "bottom-center" }
          );
          return false
        }
      }
    } else if (level == 3) {
      if (isActive) {
        if (!isExtendable) {
          toast.error(
            `Level 3 can be only Extended:- \n 1) Minimum 20 Direct Referals \n 2) Previous Levels must be Active`,
            { position: "bottom-center" }
          );
          return false
        }
      } else {
        if (!canActivate) {
          toast.error(
            `Level 3 can be only Activated:- \n 1) After 80 days of Purchase of Level 2 \n 2) Minimum 10 Direct Referals \n 3) Previous Levels must be Active`,
            { position: "bottom-center" }
          );
          return false
        }
      }
    }

    return true
  }

  const Buy = async (level) => {
    if (previewId) { return }

    let value = LEVEL_PRICE[level - 1];

    if (!checkCriteria(level)) return

    const buytoast = toast.loading(
      "Waiting for Transaction Confirmation!! Data will get updated automatically",
      { position: "bottom-center", style: { marginTop: "80px" } }
    );
    return await Utils.contract
      .buyLevel(level)
      .send({
        feeLimit: 200_000_000,
        callValue: 1000000 * value,
        shouldPollResponse: true,
      })
      .then(async (res) => {

        await FetchData();
        toast.success(
          `Transaction confirmed successfully!! Level ${level} bought successfully`,
          { position: "bottom-center", style: { marginTop: "80px" } }
        );
        toast.remove(buytoast);
      })
      .catch(async (err) => {
        if (err.error != "Cannot find result in solidity node") {
          toast.remove(buytoast);

          toast.error(`Transaction Failed!! Level ${level} purchase failed`, {
            position: "bottom-center",
            style: { marginTop: "80px" },
          });
        }

        // Cannot find result in solidity node
        // console.log(err);
        await FetchData();
        // console.log(err);
        toast.remove(buytoast);

        if (err.error == "Cannot find result in solidity node") {
          toast.success(
            `Transaction confirmed successfully!! Level ${level} bought successfully`,
            { position: "bottom-center", style: { marginTop: "80px" } }
          );
        }
      });
  };

  const FetchLevels = async (address) => {
    let Temp = {};

    for await (const level of Array.from({ length: 3 }, (_, i) => i + 1)) {
      Temp[`${level}`] = null;

      const checkLevel = await Utils.contract
        .viewUserLevelExpired(address, level)
        .call();
      const currentTimestamp = await Promise.resolve(checkLevel);
      // console.log(currentTimestamp.toNumber() * 1000, Date.now());
      if (
        Date.now() > currentTimestamp.toNumber() * 1000 &&
        currentTimestamp.toNumber() * 1000 != 0
      ) {
        Temp[`${level}`] = {
          expired: true,
          expiredAgo:
            (new Date(currentTimestamp.toNumber() * 1000).getTime() -
              new Date(Date.now()).getTime()) /
            (1000 * 60 * 60 * 24),
          active: false,
          disabled: level == 1 ? false : true,
        };
      } else if (
        currentTimestamp.toNumber() * 1000 > Date.now() &&
        currentTimestamp.toNumber() * 1000 != 0
      ) {
        Temp[`${level}`] = {
          expired: false,
          expiredAgo:
            (new Date(currentTimestamp.toNumber() * 1000).getTime() -
              new Date(Date.now()).getTime()) /
            (1000 * 60 * 60 * 24),
          active: true,
          disabled: false,
        };
      } else {
        Temp[`${level}`] = {
          expired: false,
          expiredAgo:
            (new Date(currentTimestamp.toNumber() * 1000).getTime() -
              new Date(Date.now()).getTime()) /
            (1000 * 60 * 60 * 24),
          active: false,
          disabled: true,
        };
      }
    }

    let TempActive = 0;
    for await (const i of Array.from({ length: 10 }, (_, i) => i + 1)) {
      Temp[`${i}`].expiredAgo = Math.round(Temp[`${i}`].expiredAgo, 0);
      if (Temp[`${i}`].active == true) {
        TempActive = i + 1;
        if (Temp[`${TempActive}`] != undefined) {
          Temp[`${TempActive}`]["disabled"] = false;
        }
      }
    }
    Temp[`${1}`]["disabled"] = false;

    //if User in preview mode
    if (previewId != null) {
      for await (const i of Array.from({ length: 10 }, (_, i) => i + 1)) {
        Temp[`${i}`]["disabled"] = true;
      }
    }

    // console.log(Temp);

    return Temp;
  };

  return (
    <div className="panel">
      <div className="con">
        <Toaster />

        <h1 className="header">Office</h1>
        <div className="control">
          <div className="CoverDiv">
            <div class="contentcard_tabs_active">
              <div class="contentcard_tabs_info">
                <img
                  src={Pocket1Icon}
                  width="45"
                  alt=""
                  class="contentcard_tabs_active_circle--green"
                />
                <div class="contentcard_tabs_active_text_price">
                  <strong class="bold-text-2">
                    <CountUp
                      duration={1}
                      className="bold-text-2"
                      end={coinsCount}
                    />{" "}
                    TRX
                  </strong>
                </div>
              </div>
              <div class="contentcard_tabs_label">Earned TRX</div>
            </div>

            <div class="contentcard_tabs_active">
              <div class="contentcard_tabs_info">
                <img
                  src={Pocket2Icon}
                  width="45"
                  alt=""
                  class="contentcard_tabs_active_circle--green"
                />
                <div class="contentcard_tabs_active_text_price">
                  <strong class="bold-text-2 profit">
                    {"$ "}
                    <CountUp
                      decimals={6}
                      duration={1}
                      className="bold-text-2"
                      end={coinPrice * coinsCount}
                    />
                  </strong>
                </div>
              </div>
              <div class="contentcard_tabs_label">Earned Dollar</div>
            </div>

            <div class="contentcard_tabs_active">
              <div class="contentcard_tabs_info">
                <img
                  src={Pocket3Icon}
                  width="45"
                  alt=""
                  class="contentcard_tabs_active_circle--green"
                />
                <div class="contentcard_tabs_active_text_price">
                  <strong class="bold-text-2">
                    {" "}
                    <strong class="bold-text-2">
                      <CountUp
                        duration={1}
                        className="bold-text-2"
                        end={directPartners}
                      />
                      {" / "}
                      <CountUp
                        duration={1}
                        className="bold-text-2"
                        end={indirectPartners}
                      />
                    </strong>
                  </strong>
                </div>
              </div>
              <div class="contentcard_tabs_label">
                Direct / Indirect Partners
              </div>
            </div>

            <div class="contentcard_tabs_active">
              <div class="contentcard_tabs_info">
                <img
                  src={Pocket4Icon}
                  width="45"
                  alt=""
                  class="contentcard_tabs_active_circle--green"
                />
                <div class="contentcard_tabs_active_text_price">
                  <strong class="bold-text-2">
                    <CountUp
                      duration={1}
                      className="bold-text-2"
                      end={currentLevel}
                    />
                  </strong>
                </div>
              </div>
              <div class="contentcard_tabs_label">Current Level</div>
            </div>
          </div>
        </div>

        {!LoadingLevels ? (
          <div className="LowerContainer">
            <div className="ChartDiv">
              <h2>Referals</h2>
              <Chart data={chartData} />
            </div>


            {LevelsData.map((data, index) => (
              <div key={index} className="PurchaseWrapper">
                <h2>Level {index + 1}</h2>
                {data?.expires == 0 ? <p style={{ color: "#f65e72" }} >Inactive</p> :
                  data?.active ?
                    <p>Active</p> : <p style={{ color: "#f65e72" }} >Expired</p>}

                <div className="CostWrapper">
                  <h2>
                    {LEVEL_PRICE[index]}
                    TRX
                  </h2>
                  {
                    data?.expires != 0 && (
                      data?.expires >= 0 ? (
                        <p>Validity : {data?.expires} days left</p>
                      ) : (
                        <p>Expired : {data?.expires} days ago</p>
                      ))}
                </div>
                <div
                  style={{ opacity: previewId && 0.5, cursor: previewId && "not-allowed" }}
                  onClick={() => Buy(index + 1)}
                  className={`Button ${data?.expires <= 0 ? "ButtonRed" : "ButtonActivated"
                    }`}
                >
                  {/* Upgrade Now */}
                  {data?.expires == 0
                    ? `Activate Now`
                    : data?.expires < 0
                      ? `Reactivate Now`
                      : `Extend Now`}
                </div>
              </div>
            ))}



          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner
              variant="primary"
              size="200px"
              animation="border"
              role="status"
            >
              <span style={{ color: "black" }} className="visually-hidden">
                Loading...
              </span>
            </Spinner>
          </div>
        )}
      </div>

      <br />


    </div>
  );
}
export default Controlpanel;
