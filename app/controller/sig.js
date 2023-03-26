'use strict';

const { Controller } = require('egg');
const { ethers, Contract } = require('ethers');
const { RESP_CODE_ILLEGAL_PARAM, CHAIN_NAME_MUMBAI } = require('../utils/constant');
const { newNormalResp, newResp } = require('./data');
const M4mBaggage = require('../contracts/M4mBaggageWithoutRole.json');
const env = require('../../config/env.json');

class SigController extends Controller {

  async sigGameEnd() {
    const { ctx } = this;
    const param = ctx.request.body;
    const lootLength = param.loot_ids.length;
    const lostLength = param.lost_ids.length;
    if (lootLength !== param.loot_amounts.length || lostLength !== param.lost_amounts.length) {
      ctx.body = newResp(RESP_CODE_ILLEGAL_PARAM, 'params length unmatched', {});
      return;
    }
    const chainCfg = this.config[param.chain_name ? param.chain_name : CHAIN_NAME_MUMBAI];
    const provider = new ethers.JsonRpcProvider(chainCfg.nodeUrl);
    const m4mBaggage = new Contract(chainCfg.baggageContract, M4mBaggage.abi, provider);
    const operatorSigningKey = new ethers.SigningKey('0x' + env.GAME_SIGNER_PRIV_KEY);
    const info = await m4mBaggage.lockedNFTs(param.m4m_token_id);
    console.log(info);
    const hash = ethers.solidityPackedKeccak256([ 'bytes' ],
      [ ethers.solidityPacked([ 'address', 'uint', 'uint', 'string', `uint[${lootLength}]`,
        `uint[${lootLength}]`, `uint[${lostLength}]`, `uint[${lostLength}]` ],
      [ info.owner, param.m4m_token_id, info.gameId, info.uuid, param.loot_ids, param.loot_amounts,
        param.lost_ids, param.lost_amounts ]) ]);
    const operatorSig = operatorSigningKey.sign(hash);
    ctx.body = newNormalResp(operatorSig.serialized);
  }

  async sigUnlockComponents() {
    const { ctx } = this;
    const param = ctx.request.body;
    if (!param.nonce) {
      ctx.body = newResp(RESP_CODE_ILLEGAL_PARAM, 'nonce required', {});
      return;
    }
    const chainCfg = this.config[param.chain_name ? param.chain_name : CHAIN_NAME_MUMBAI];
    const provider = new ethers.JsonRpcProvider(chainCfg.nodeUrl);
    const m4mBaggage = new Contract(chainCfg.baggageContract, M4mBaggage.abi, provider);
    const operatorSigningKey = new ethers.SigningKey('0x' + env.GAME_SIGNER_PRIV_KEY);
    const info = await m4mBaggage.lockedEmptyNFTs(param.m4m_token_id);
    console.log(info);
    const hash = ethers.solidityPackedKeccak256([ 'bytes' ],
      [ ethers.solidityPacked([ 'uint', 'uint', 'uint', `uint[${param.out_component_ids.length}]` ],
        [ param.m4m_token_id, param.nonce, info.gameId, param.out_component_ids ]) ]);
    const operatorSig = operatorSigningKey.sign(hash);
    ctx.body = newNormalResp(operatorSig.serialized);
  }


  async sigSettleLoots() {
    const { ctx } = this;
    const param = ctx.request.body;
    if (!param.nonce) {
      ctx.body = newResp(RESP_CODE_ILLEGAL_PARAM, 'nonce required', {});
      return;
    }
    const lootLength = param.loot_ids.length;
    const lostLength = param.lost_ids.length;
    if (lootLength !== param.loot_amounts.length || lostLength !== param.lost_amounts.length) {
      ctx.body = newResp(RESP_CODE_ILLEGAL_PARAM, 'params length unmatched', {});
      return;
    }
    const chainCfg = this.config[param.chain_name ? param.chain_name : CHAIN_NAME_MUMBAI];
    const provider = new ethers.JsonRpcProvider(chainCfg.nodeUrl);
    const m4mBaggage = new Contract(chainCfg.baggageContract, M4mBaggage.abi, provider);
    const operatorSigningKey = new ethers.SigningKey('0x' + env.GAME_SIGNER_PRIV_KEY);
    const info = await m4mBaggage.lockedEmptyNFTs(param.m4m_token_id);
    const hash = ethers.solidityPackedKeccak256([ 'bytes' ],
      [ ethers.solidityPacked([ 'uint', 'uint', 'uint', `uint[${lootLength}]`,
        `uint[${lootLength}]`, `uint[${lostLength}]`, `uint[${lostLength}]` ],
      [ param.m4m_token_id, info.gameId, param.nonce, param.loot_ids, param.loot_amounts,
        param.lost_ids, param.lost_amounts ]) ]);
    const operatorSig = operatorSigningKey.sign(hash);
    ctx.body = newNormalResp(operatorSig.serialized);
  }

  async signPrepareAndMint() {
    const { ctx } = this;
    const requestParams = ctx.request.body;
    if (!requestParams.nonce) {
      ctx.body = newResp(RESP_CODE_ILLEGAL_PARAM, 'nonce required', {});
      return;
    }
    const paramsHashes = [];
    for (const param of requestParams.params) {
      paramsHashes.push(ethers.solidityPackedKeccak256([ 'bytes' ],
        [ ethers.solidityPacked([ 'uint', 'bool', 'string', 'string', 'uint' ],
          [ param.tokenId, param.prepare, param.name, param.symbol, param.amount ]) ]));
    }
    const chainCfg = this.config[requestParams.chain_name ? requestParams.chain_name : CHAIN_NAME_MUMBAI];
    const provider = new ethers.JsonRpcProvider(chainCfg.nodeUrl);
    const m4mBaggage = new Contract(chainCfg.baggageContract, M4mBaggage.abi, provider);
    const operatorSigningKey = new ethers.SigningKey('0x' + env.GAME_SIGNER_PRIV_KEY);
    const info = await m4mBaggage.lockedEmptyNFTs(requestParams.m4m_token_id);
    const hash = ethers.solidityPackedKeccak256([ 'bytes' ],
      [ ethers.solidityPacked([ 'uint', 'uint', 'uint', `bytes32[${requestParams.params.length}]` ],
        [ requestParams.m4m_token_id, info.gameId, requestParams.nonce, paramsHashes ]) ]);
    const operatorSig = operatorSigningKey.sign(hash);
    ctx.body = newNormalResp(operatorSig.serialized);
  }

  async signMsg() {
    const { ctx } = this;
    const param = ctx.query;
    const wallet = new ethers.Wallet('0x' + env.GAME_SIGNER_PRIV_KEY);
    const sig = await wallet.signMessage(param.msg);
    ctx.body = newNormalResp(sig);
  }

  async signVersionInfo() {
    const { ctx } = this;
    const requestParams = ctx.request.body;
    const tokenHash = ethers.solidityPackedKeccak256([ 'bytes' ],
      [ ethers.solidityPacked([ 'uint', 'address', 'uint' ], [ requestParams.chain_id, requestParams.nft, requestParams.token_id ]) ]);
    const hash = ethers.solidityPackedKeccak256([ 'bytes' ],
      [ ethers.solidityPacked([ 'bytes32', 'string' ], [ tokenHash, requestParams.uri ]) ]);
    const operatorSigningKey = new ethers.SigningKey('0x' + env.GAME_SIGNER_PRIV_KEY);
    const operatorSig = operatorSigningKey.sign(hash);
    ctx.body = newNormalResp(operatorSig.serialized);
  }
}

module.exports = SigController;
