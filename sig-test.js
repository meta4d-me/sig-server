'use strict';

const {ethers, Contract} = require("ethers");
const env = require("./config/env.json");
const {CHAIN_NAME_MUMBAI} = require("./app/utils/constant");
const M4mBaggage = require("./app/contracts/M4mBaggageWithoutRole.json");

// sign game end
let lootIds = [4];
let lootAmounts = [1];
let lostIds = [0, 1, 2, 3];
let lostAmounts = [1, 1, 1, 1];
let gameId = 123123;
let uuid = '12312312313132';
let owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
let m4m_token_id = '35924222129805867980321537742642229888739636408395583372769011476325043187169';
let operatorSigningKey = new ethers.SigningKey('0x' + env.GAME_SIGNER_PRIV_KEY);
let hash = ethers.solidityPackedKeccak256(['bytes'],
    [ethers.solidityPacked(['address', 'uint', 'uint', 'string', `uint[1]`,
            `uint[1]`, `uint[4]`, `uint[4]`],
        [owner, m4m_token_id, gameId, uuid, lootIds, lootAmounts, lostIds, lostAmounts])]);
let operatorSig = operatorSigningKey.sign(hash);
console.log(operatorSig.serialized);

// sign settle
lootIds = [6];
lootAmounts = [1];
lostIds = [5];
lostAmounts = [1];
let nonce = 1;
hash = ethers.solidityPackedKeccak256(['bytes'],
    [ethers.solidityPacked(['uint', 'uint', 'uint', 'uint[1]', 'uint[1]', 'uint[1]', 'uint[1]'],
        [m4m_token_id, gameId, nonce, lootIds, lootAmounts, lostIds, lostAmounts])]);
operatorSig = operatorSigningKey.sign(hash);
console.log(operatorSig.serialized);

// sign unlock
m4m_token_id = 123123;
let out_component_ids = [5]
nonce = 2;
hash = ethers.solidityPackedKeccak256(['bytes'],
    [ethers.solidityPacked(['uint', 'uint', 'uint', `uint[${out_component_ids.length}]`],
        [m4m_token_id, nonce, gameId, out_component_ids])]);
operatorSig = operatorSigningKey.sign(hash);
console.log(operatorSig.serialized);

let requestParams = {
    m4m_token_id: '399712059115176241',
    nonce: 1,
    params: [{tokenId: 1, prepare: true, name: 'test', symbol: 'aaa', amount: 1}],
    gameSignerSig: '0x7f1838f63bb1011fca9e4b34b4273686896a78256ef464dc7c3e2012C9C9f0474920ddae81f7d2C7C0503528af99db4b4059dc628cdd9c5ef0f899337face45f1c',
}
console.log(JSON.stringify(requestParams));
let paramsHashes = [];
for (const param of requestParams.params) {
    paramsHashes.push(ethers.solidityPackedKeccak256(['bytes'],
        [ethers.solidityPacked(['uint', 'bool', 'string', 'string', 'uint'],
            [param.tokenId, param.prepare, param.name, param.symbol, param.amount])]));
}
hash = ethers.solidityPackedKeccak256(['bytes'],
    [ethers.solidityPacked(['uint', 'uint', 'uint', `bytes32[${requestParams.params.length}]`],
        [requestParams.m4m_token_id, 0, requestParams.nonce, paramsHashes])]);
// 0x1b4CcB14353bA3e628d8aD4F1F5ECae9C08B82eA
console.log(ethers.recoverAddress(hash, requestParams.gameSignerSig));
