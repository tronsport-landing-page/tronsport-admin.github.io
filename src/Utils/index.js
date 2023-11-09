const contractAddress = "TYWuL6SEU4PdPTgG9iGHPdYbqXiYQjFvvW"
// "TRx9XRUiP8mf7wqa9EQrx5SuMNmou397hP"
// "TJYqBJz8brbJ67WfTSD7QDtm3RkppX3DoQ"
// "TVeWyJgWMwPWP1rHz5i7UCrfEVB7KmaHcH"

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

