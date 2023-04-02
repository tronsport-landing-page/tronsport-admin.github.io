import React, { useEffect, useState } from "react";
import "./Levels.css";
function Levels({ Utils, address }) {
  const [LevelsData, setLevelsData] = useState({});

  const Buy = async (value) => {
    return await Utils.contract
      .buyLevel(1)
      .send({
        feeLimit: 200_000_000,
        callValue: 0,
        tokenId: 1000036,
        tokenValue: value,
        shouldPollResponse: true,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const FetchLevels = async (address) => {
    let Temp = {};

    for await (const level of Array.from({ length: 10 }, (_, i) => i + 1)) {
      Temp[`${level}`] = null;

      const checkLevel = await Utils.contract
        .viewUserLevelExpired(address, level)
        .call();
      const currentTimestamp = await Promise.resolve(checkLevel);
      if (
        currentTimestamp.toNumber() > Date.now() &&
        currentTimestamp.toNumber() != 0
      ) {
        Temp[`${level}`] = {
          expired: true,
          exipredAgo:
            (new Date(currentTimestamp.toNumber()).getTime() -
              new Date(Date.now()).getTime()) /
            (1000 * 60 * 60 * 24),
          active: false,
          disabled: level == 1 ? false : true
        };
      } else if (
        currentTimestamp.toNumber() < Date.now() &&
        currentTimestamp.toNumber() != 0
      ) {
        Temp[`${level}`] = {
          expired: false,
          exipredAgo:
            (new Date(currentTimestamp.toNumber()).getTime() -
              new Date(Date.now()).getTime()) /
            (1000 * 60 * 60 * 24),
          active: true,
          disabled: false

        };
      } else {
        Temp[`${level}`] = {
          expired: false,
          exipredAgo:
            (new Date(currentTimestamp.toNumber()).getTime() -
              new Date(Date.now()).getTime()) /
            (1000 * 60 * 60 * 24),
          active: false,
          disabled: true
        };
      }
    }

    let TempActive = 0;
    for await (const i of Array.from({ length: 10 }, (_, i) => i + 1)) {
      if (Temp[`${i}`].active == true) {
        TempActive = i + 1;
        Temp[`${TempActive}`].disabled = false;

      }

    }
    Temp[`${1}`].disabled = false;



    return Temp;
  };

  useEffect(async () => {
    await FetchLevels(address).then((data) => {
      setLevelsData(data);
    });
  }, [Utils]);

  return (
    <div className="level">
      <div className="row1">
        <div className="card">
          <center>
            <div className="lvl">Level 1</div>

            <div className="days">Inactive</div>

            <hr className="line" />

            <div class="levelval">300 TRX</div>

            <button
              style={{ opacity: LevelsData["1"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(300)}
              className="btn"
            >
              <p>Buy</p>
            </button>
          </center>
        </div>
        <div className="card">
          <center>
            <div className="lvl">Level 2</div>

            <div className="days">Inactive</div>

            <hr className="line" />

            <div class="levelval">600 TRX</div>

            <button
              style={{ opacity: LevelsData["2"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(600)}
              className="btn"
            >
              <p>Buy</p>
            </button>
          </center>
        </div>
        <div className="card">
          <center>
            <div className="lvl">Level 3</div>

            <div className="days">Inactive</div>

            <hr className="line" />

            <div class="levelval">1250 TRX</div>

            <button
              style={{ opacity: LevelsData["3"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(1250)}
              className="btn"
            >
              <p>Buy</p>
            </button>
          </center>
        </div>
        <div className="card">
          <center>
            <div className="lvl">Level 4</div>

            <div className="days">Inactive</div>

            <hr className="line" />

            <div class="levelval">2500 TRX</div>

            <button
              style={{ opacity: LevelsData["4"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(2500)}
              className="btn"
            >
              <p>Buy</p>
            </button>
          </center>
        </div>

        <div className="card-expired">
          <center>
            <div className="lvl">Level 5</div>

            <div className="days">Expired 660 days ago</div>

            <hr className="line" />

            <div class="levelval">5000 TRX</div>

            <button
              style={{ opacity: LevelsData["5"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(5000)}
              className="btn"
            >
              <p>Restore</p>
            </button>
          </center>
        </div>

        <div className="card-expired">
          <center>
            <div className="lvl">Level 6</div>

            <div className="days">Expired 660 days ago</div>

            <hr className="line" />

            <div class="levelval">10000 TRX</div>

            <button
              style={{ opacity: LevelsData["6"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(10000)}
              className="btn"
            >
              <p>Restore</p>
            </button>
          </center>
        </div>
        <div className="card-expired">
          <center>
            <div className="lvl">Level 7</div>

            <div className="days">Expired 660 days ago</div>

            <hr className="line" />

            <div class="levelval">25000 TRX</div>

            <button
              style={{ opacity: LevelsData["7"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(25000)}
              className="btn"
            >
              <p>Restore</p>
            </button>
          </center>
        </div>
        <div className="card-expired">
          <center>
            <div className="lvl">Level 8</div>

            <div className="days">Expired 660 days ago</div>

            <hr className="line" />

            <div class="levelval">50000 TRX</div>

            <button
              style={{ opacity: LevelsData["8"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(50000)}
              className="btn"
            >
              <p>Restore</p>
            </button>
          </center>
        </div>
        <div className="card-expired">
          <center>
            <div className="lvl">Level 9</div>

            <div className="days">Expired 660 days ago</div>

            <hr className="line" />

            <div class="levelval">100000 TRX</div>

            <button
              style={{ opacity: LevelsData["9"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(100000)}
              className="btn"
            >
              <p>Restore</p>
            </button>
          </center>
        </div>
        <div className="card-expired">
          <center>
            <div className="lvl">Level 10</div>

            <div className="days">Expired 660 days ago</div>

            <hr className="line" />

            <div class="levelval">200000 TRX</div>

            <button
              style={{ opacity: LevelsData["10"]?.disabled ? 0.5 : 1 }}
              onClick={() => Buy(200000)}
              className="btn"
            >
              <p>Restore</p>
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}
export default Levels;
