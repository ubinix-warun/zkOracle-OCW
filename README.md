# zkOracle and Off-chain worker

zkOracle/Off-chain worker for MINA protocol 

## Setup contract and Keygen 

```
cd zkOracle-OFW/contracts
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

## Run test contract

```
cd zkOracle-OFW/contracts
npm run test

> node --experimental-vm-modules --experimental-wasm-modules 
  --experimental-wasm-threads node_modules/jest/bin/jest.js

(node:128511) ExperimentalWarning: VM Modules is an experimental feature. 
  This feature could change at any time
  (Use `node --trace-warnings ...` to show where the warning was created)
Browserslist: caniuse-lite is outdated. Please run:
  npx browserslist@latest --update-db
  Why you should do it regularly: 
    https://github.com/browserslist/browserslist#browsers-data-updating
  console.log
    request https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD
           - offchain-value 'RAW.ETH.USD.PRICE' = 1324.07
           - onchain-value 'RAW.ETH.USD.PRICE' = 1324.07

      at Object.<anonymous> (src/OffchainOracle.test.ts:141:15)

 PASS  src/OffchainOracle.test.ts (64.737 s)
  OffchainOracle
    ✓ generates and deploys the `OffchainOracle` smart contract (8924 ms)
    actual API requests
      ✓ create nextRound event for demo ofw (Off-chain worker) (31609 ms)
      ✓ call feed Data for demo ofw (Off-chain worker) (12637 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        64.822 s, estimated 77 s
Ran all test suites.
  ●  process.exit called with "0"

      at Timeout.shutdown [as _onTimeout] (node_modules/snarkyjs/src/snarky/wrapper.js:15:11)

```

## Deploy 

```

```