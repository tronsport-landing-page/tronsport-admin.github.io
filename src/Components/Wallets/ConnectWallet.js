import React from "react";
import logo from "../../Assets/tronlink.png";

const ConnectWallet = ({ Connect }) => {
  return (
    <div onClick={() => Connect()} className="Wallet-Circle">
    <img width={30} src={logo} />
    <span>Connect to Tron Wallet</span>
  </div>
  );
};

export default ConnectWallet;
