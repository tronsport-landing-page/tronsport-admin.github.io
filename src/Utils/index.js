const contractAddress = "TLN8FxUVjTrmCrhBxEDZzKgZTHeVdeWGrW"
// "TJ1spKFfV3As7AhSpJqB6d8E82tAp37JXi"

// "TLHbZrdCGXn9KLvb6qvygYWHJZ7ucLyRy8" Version 1 (MAIN NET)
// "TVtd6PSWS9qfW9RBYkwinoSAVD56zAzSMK"; Version = 3 (TEST)
// "TP3knTX2vSsPxpffb5Fe8XMgMCuqhXZdms" Version = 2(TEST)
// 'TLoV6Qr7tqDnHi641jG2hXZLQYUd4RTTAs' Version = 1(TEST)

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

