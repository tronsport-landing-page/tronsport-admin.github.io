const contractAddress = "TXYKxSMCT2P2c9PuPa8ZjC3dw6AGicDopx"

// "TXYKxSMCT2P2c9PuPa8ZjC3dw6AGicDopx" ; Version = 1 (TEST)

const utils = {
    tronWeb: false,
    contract: false,
    contractAddress:contractAddress,

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress)
    },

};

export default utils;

