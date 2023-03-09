'use strict';

const {ethers} = require("ethers");
const env = require("./config/env.json");

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

// sign unlock
m4m_token_id = 123123;
let out_component_ids = [5]
hash = ethers.solidityPackedKeccak256(['bytes'],
    [ethers.solidityPacked(['uint', 'uint', `uint[${out_component_ids.length}]`],
        [m4m_token_id, gameId, out_component_ids])]);
operatorSig = operatorSigningKey.sign(hash);
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
