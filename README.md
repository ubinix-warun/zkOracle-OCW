# zkOracle and Off-chain worker

zkOracle/Off-chain worker for MINA protocol 

## Run Keygen & Test contract

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


> zkoracle-ofw@0.2.0 test
> node --experimental-vm-modules --experimental-wasm-modules --experimental-wasm-threads node_modules/jest/bin/jest.js

(node:126546) ExperimentalWarning: VM Modules is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Browserslist: caniuse-lite is outdated. Please run:
  npx browserslist@latest --update-db
  Why you should do it regularly: https://github.com/browserslist/browserslist#browsers-data-updating
  console.log
     test 'RAW.ETH.USD.PRICE' =  1321.99

      at Object.<anonymous> (src/OffchainOracle.test.ts:138:15)

  console.log
     test 'RAW.ETH.USD.PRICE' =  1321.99

      at Object.<anonymous> (src/OffchainOracle.test.ts:139:15)

 PASS  src/OffchainOracle.test.ts (65.512 s)
  OffchainOracle
    ✓ generates and deploys the `OffchainOracle` smart contract (9153 ms)
    actual API requests
      ✓ create nextRound event for demo ofw (Off-chain worker) (31440 ms)
      ✓ call feed Data for demo ofw (Off-chain worker) (13362 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        65.598 s
Ran all test suites.
  ●  process.exit called with "0"

      at Timeout.shutdown [as _onTimeout] (node_modules/snarkyjs/src/snarky/wrapper.js:15:1


```


## Deploy 

```

```