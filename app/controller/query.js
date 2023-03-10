'use strict';

const {Controller} = require('egg');
const {ethers, Contract} = require("ethers");
const {RESP_CODE_NORMAL_ERROR} = require("../utils/constant");
const {newNormalResp, newResp} = require("./data");
const M4mBaggage = require("../contracts/M4mBaggageWithoutRole.json");

class QueryController extends Controller {

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
            confirmed: tx.blockNumber && currentHeight - tx.blockNumber > chainCfg.confirmedBlock,
            success: tx.status === 1
        })
    }

    async queryLockedStatus() {
        const {ctx} = this;
        let param = ctx.query;
        ctx.validate({
            chain_name: 'chainName'
        }, param);
        let chainCfg = this.config[param.chain_name];
        let provider = new ethers.JsonRpcProvider(chainCfg.nodeUrl);
        let m4mBaggage = new Contract(chainCfg.baggageContract, M4mBaggage.abi, provider);
        let lockedInfo = await m4mBaggage.lockedEmptyNFTs(param.m4m_token_id);
        let res = {
            game_id: lockedInfo.gameId.toString(),
            owner: lockedInfo.owner.toString(),
            used_nonce: lockedInfo.usedNonce.toString(),
        };
        if (param.component_ids) {
            res.locked_amounts = [];
            const component_ids = param.component_ids.split(",");
            for (const id of component_ids) {
                res.locked_amounts.push((await m4mBaggage.lockedComponents(param.m4m_token_id, id)).toString());
            }
        }
        console.log(res);
        ctx.body = newNormalResp(res);
    }
}

module.exports = QueryController;
