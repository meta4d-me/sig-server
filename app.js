const ethers = require("ethers");
const constant = require('./app/utils/constant')

module.exports = app => {
    app.validator.addRule('address', (rule, value) => {
        if (!ethers.isAddress(value)) {
            return 'illegal addr';
        }
    })
    app.validator.addRule('chainName', (rule, value) => {
        if (value !== constant.CHAIN_NAME_MUMBAI) {
            return 'illegal chain name';
        }
    })
};
