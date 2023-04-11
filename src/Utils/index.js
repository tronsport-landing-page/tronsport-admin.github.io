const contractAddress = "TPo2EexpvUey8dJ9tcpXvQ5SPCKekyZ6Dm"

// "TCYusnqzTJZkZJaDCVVz4pbemugN4CbMv7" ; Version = 1 (TEST)

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

