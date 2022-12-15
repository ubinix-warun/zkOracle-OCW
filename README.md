# zkOracle and Off-chain worker

zkOracle/Off-chain worker for MINA protocol 

## Setup contract and Keygen 

```
cd zkOracle-OCW/contracts
npm install
```

```
node scripts/keygen.js > scripts/key.json
```

```
cat scripts/key.json
{
  "privateKey": "<>",
  "publicKey": "<>"
}
```

## Build and test contract

```
cd zkOracle-OCW/contracts
npm run build
```

```
cd zkOracle-OCW/contracts
npm run test

> node --experimental-vm-modules --experimental-wasm-modules 
  --experimental-wasm-threads node_modules/jest/bin/jest.js

 ...

 PASS  src/OffchainOracle.test.ts (101.53 s)
  OffchainOracle
    ✓ generates and deploys the `OffchainOracle` smart contract (9209 ms)
    simulate single operator
      ✓ create nextRound event for demo ocw (Off-chain worker) (30867 ms)
      ✓ call feed Data for demo ocw (Off-chain worker) (12556 ms)
    actual API requests
      ✓ call feed ETH price for demo ocw (Off-chain signer) (12523 ms)
      ✓ call feed MINA price for demo ocw (Off-chain signer) (12524 ms)
      ✓ call feed DOT price for demo ocw (Off-chain signer) (12793 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        101.618 s
Ran all test suites.
  ●  process.exit called with "0"

```

<details>
  <summary><b><h3>Scenario 1 -- CreateTopic via Webhook (SENDER)</h3></b></summary>

</details>



<details>
  <summary><b><h3>Scenario 2 -- CreateTopic via Webhook (SENDER)</h3></b></summary>

</details>



## Deploy 

```
cd zkOracle-OCW/contracts
zk config

-- Name: berkeley
-- URL: https://proxy.berkeley.minaexplorer.com/graphql
-- Fee: 0.1

zk deploy

```

## Credit

* [MINA Protocol](https://minaprotocol.com/) - Mina is building the privacy and security layer for web3.
* [mina-credit-score-signer](https://github.com/jackryanservia/mina-credit-score-signer) - Koa API that signs a specified user’s fake credit score with a Mina compatible signature scheme.
* [chainlink-polkadot](https://github.com/smartcontractkit/chainlink-polkadot/tree/master/pallet-chainlink) - This pallet allows your substrate built parachain/blockchain to interract with chainlink. 