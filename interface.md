# M4M Sig Server Interface Doc

## Definition

### Chain Name & Chain Id

supported chain:

| chain name | chain id | DESC         |
|------------|----------|--------------|
| mumbai     |          | polygon test |

Sig server usually use chain name as params, not chain id.

### Return Value

uniform return:

```json
{
  "code": "",
  "error": "",
  "data": {}
}
```

#### code

`code=0` means that success, others is failed。

#### error

when `code!=0`, return error info。

#### data

response result.

## Interface

### Query Tx Status

Query tx status.

Method: GET

URL: /api/v1/tx?hash=xxx&chain_name=xxx

returns:

```json
{
  "code": 0,
  "err": "",
  "data": {
    "confirmed": true,
    "success": true
  }
}
```

> confirmed: tx is confirmed
>
> success: tx is successful or reverted

### Query Locked Status

Query tx status.

Method: GET

URL: /api/v1/components/locked?m4m_token_id=xxx&chain_name=xxx&component_ids=xxx

> note: component_ids should split with ',', for example: "1,2,3,4,5"

returns:

```json
{
  "code": 0,
  "err": "",
  "data": {
    "game_id": 1,
    "owner": "owner address",
    "used_nonce": 1,
    "locked_amounts": [
      1,
      1,
      1,
      1,
      1
    ]
  }
}
```

> locked_amounts is corresponding param `component_ids` 1 by 1

### Signature interface

> note: if component id or amounts is too large, maybe use string type to pass these params.

### Sign gameEnd

Method: POST

URL: /api/v1/sign/gameend

params:

```json
{
  "m4m_token_id": "123123123123123",
  "loot_ids": [
    1212,
    1213,
    1214
  ],
  "loot_amounts": [
    1,
    2,
    3
  ],
  "lost_ids": [
    1214,
    1216,
    1217
  ],
  "lost_amounts": [
    1,
    2,
    3
  ]
}
```

returns:

```json
{
  "code": 0,
  "err": "",
  "data": "0x12123121312"
}
```

### Sign unlockComponents

Method: POST

URL: /api/v1/sign/unlockcomponents

params:

```json
{
  "m4m_token_id": "123123123123123",
  "nonce": 1,
  "out_component_ids": [
    1212,
    1213,
    1214
  ]
}
```

returns:

```json
{
  "code": 0,
  "err": "",
  "data": "0x12123121312"
}
```

### Sign settleLoots

Method: POST

URL: /api/v1/sign/settleloots

params:

```json
{
  "m4m_token_id": "123123123123123",
  "nonce": 2,
  "loot_ids": [
    1212,
    1213,
    1214
  ],
  "loot_amounts": [
    1,
    2,
    3
  ],
  "lost_ids": [
    1214,
    1216,
    1217
  ],
  "lost_amounts": [
    1,
    2,
    3
  ]
}
```

returns:

```json
{
  "code": 0,
  "err": "",
  "data": "0x12123121312"
}
```

### Sign Wrap Prepare And Mint

Method: POST

URL: /api/v1/sign/prepare-mint

params:

```json
{
  "m4m_token_id": "123123123123123",
  "nonce": 2,
  "params": [
    {
      "tokenId": 21,
      "prepare": true,
      "name": "test 2",
      "symbol": "test symbol 2",
      "amount": 1
    },
    {
      "tokenId": 22,
      "prepare": false,
      "name": "",
      "symbol": "",
      "amount": 1
    }
  ]
}
```

> note: if params.prepare is true, prepare new component, if params.prepare is false, params.name and params.symbol must
> be ''

returns:

```json
{
  "code": 0,
  "err": "",
  "data": "0x12123121312"
}
```

### Sign Message

Method: GET

URL: /api/v1/sign?msg=xxxxx

returns:

```json
{
  "code": 0,
  "err": "",
  "data": "0x12123121312"
}
```
