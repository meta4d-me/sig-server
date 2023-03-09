'use strict';

const {Controller} = require('egg');
const {ethers} = require("ethers");
const {RESP_CODE_NORMAL_ERROR} = require("../utils/constant");
const {newNormalResp, newResp} = require("./data");

class TxController extends Controller {

    async queryTxStatus() {
        const {ctx} = this;
        let param = ctx.query;
        ctx.validate({
            chain_name: 'chainName'
        }, param);
        let chainCfg = this.config[param.chain_name];
        let provider = new ethers.JsonRpcProvider(chainCfg.nodeUrl);
        let tx = await provider.getTransactionReceipt(param.hash);
        if (!tx) {
            ctx.body = newResp(RESP_CODE_NORMAL_ERROR, 'tx not found', {confirmed: false, success: false})
            return
        }
        let currentHeight = await provider.getBlockNumber();
        ctx.body = newNormalResp({
            confirmed: tx.blockNumber &&  currentHeight - tx.blockNumber > chainCfg.confirmedBlock,
            success: tx.status === 1
        })
    }
}

module.exports = TxController;
