'use strict';

const {Controller} = require('egg');
const {ethers, Contract} = require("ethers");
const {RESP_CODE_ILLEGAL_PARAM, CHAIN_NAME_MUMBAI} = require("../utils/constant");
const {newNormalResp, newResp} = require("./data");
const M4mBaggage = require("../contracts/M4mBaggageWithoutRole.json");
const env = require("../../config/env.json");

class SigController extends Controller {

    async sigGameEnd() {
        const {ctx} = this;
        let param = ctx.request.body;
        let lootLength = param.loot_ids.length;
        let lostLength = param.lost_ids.length;
        if (lootLength !== param.loot_amounts.length || lostLength !== param.lost_amounts.length) {
            ctx.body = newResp(RESP_CODE_ILLEGAL_PARAM, 'params length unmatched', {})
            return
        }
        let chainCfg = this.config[param.chain_name ? param.chain_name : CHAIN_NAME_MUMBAI];
        let provider = new ethers.JsonRpcProvider(chainCfg.nodeUrl);
        let m4mBaggage = new Contract(chainCfg.baggageContract, M4mBaggage.abi, provider);
        let operatorSigningKey = new ethers.SigningKey('0x' + env.GAME_SIGNER_PRIV_KEY);
        let info = await m4mBaggage.lockedNFTs(param.m4m_token_id);
        console.log(info);
        let hash = ethers.solidityPackedKeccak256(['bytes'],
            [ethers.solidityPacked(['address', 'uint', 'uint', 'string', `uint[${lootLength}]`,
                    `uint[${lootLength}]`, `uint[${lostLength}]`, `uint[${lostLength}]`],
                [info.owner, param.m4m_token_id, info.gameId, info.uuid, param.loot_ids, param.loot_amounts
                    , param.lost_ids, param.lost_amounts])]);
        let operatorSig = operatorSigningKey.sign(hash);
        ctx.body = newNormalResp(operatorSig.serialized);
    }

    async sigUnlockComponents() {
        const {ctx} = this;
        let param = ctx.request.body;
        if (!param.nonce){
            ctx.body = newResp(RESP_CODE_ILLEGAL_PARAM,'nonce required',{})
            return
        }
        let chainCfg = this.config[param.chain_name ? param.chain_name : CHAIN_NAME_MUMBAI];
        let provider = new ethers.JsonRpcProvider(chainCfg.nodeUrl);
        let m4mBaggage = new Contract(chainCfg.baggageContract, M4mBaggage.abi, provider);
        let operatorSigningKey = new ethers.SigningKey('0x' + env.GAME_SIGNER_PRIV_KEY);
        let info = await m4mBaggage.lockedEmptyNFTs(param.m4m_token_id);
        console.log(info);
        let hash = ethers.solidityPackedKeccak256(['bytes'],
            [ethers.solidityPacked(['uint', 'uint', 'uint', `uint[${param.out_component_ids.length}]`],
                [param.m4m_token_id, param.nonce, info.gameId, param.out_component_ids])]);
        let operatorSig = operatorSigningKey.sign(hash);
        ctx.body = newNormalResp(operatorSig.serialized);
    }


    async sigSettleLoots() {
        const {ctx} = this;
        let param = ctx.request.body;
        if (!param.nonce){
            ctx.body = newResp(RESP_CODE_ILLEGAL_PARAM,'nonce required',{})
            return
        }
        let lootLength = param.loot_ids.length;
        let lostLength = param.lost_ids.length;
        if (lootLength !== param.loot_amounts.length || lostLength !== param.lost_amounts.length) {
            ctx.body = newResp(RESP_CODE_ILLEGAL_PARAM, 'params length unmatched', {})
            return
        }
        let chainCfg = this.config[param.chain_name ? param.chain_name : CHAIN_NAME_MUMBAI];
        let provider = new ethers.JsonRpcProvider(chainCfg.nodeUrl);
        let m4mBaggage = new Contract(chainCfg.baggageContract, M4mBaggage.abi, provider);
        let operatorSigningKey = new ethers.SigningKey('0x' + env.GAME_SIGNER_PRIV_KEY);
        let info = await m4mBaggage.lockedEmptyNFTs(param.m4m_token_id);
        console.log(info);
        let hash = ethers.solidityPackedKeccak256(['bytes'],
            [ethers.solidityPacked(['uint', 'uint', 'uint', `uint[${lootLength}]`,
                    `uint[${lootLength}]`, `uint[${lostLength}]`, `uint[${lostLength}]`],
                [param.m4m_token_id, info.gameId, param.nonce, param.loot_ids, param.loot_amounts
                    , param.lost_ids, param.lost_amounts])]);
        let operatorSig = operatorSigningKey.sign(hash);
        ctx.body = newNormalResp(operatorSig.serialized);
    }
}

module.exports = SigController;
