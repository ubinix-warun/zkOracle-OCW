# zkOracle and Off-chain worker

the zkApps Hackathon -- [zkIgnite, Cohort 0 Begins](https://minaprotocol.com/blog/zkignite-cohort0)
> [Oracles on Mina](https://minaprotocol.com/blog/10-zkapps-use-cases-on-mina-protocol) -- authenticated data from any HTTPS website available on chain.

The zkOracle/Off-chain worker for MINA protocol, Feed On-chain Data with Worker. <br/>
Such as, ETH price, MINA or DOT from External API.

<img src="https://user-images.githubusercontent.com/3756229/208229971-cde769c3-a05a-406b-ad80-fde62fb1b66e.png" width="70%">

## Setup contract and Keygen 

* Install nodejs package on contracts.

```
cd zkOracle-OCW/contracts

npm install
```

* Generate key for backends/contracts and testing.

```
node scripts/keygen.js > scripts/key.json
```

* Validate key on key.json file.

```
cat scripts/key.json
{
  "privateKey": "<>",
  "publicKey": "<>"
}
```

## Run Offchain Worker.

<img src="https://user-images.githubusercontent.com/3756229/208219974-445a0ab1-e62a-4ac2-af12-569b0dcc53cf.png" width="80%">

```
cd zkOracle-OCW/contracts

npm run build
node build/src/worker.js

```

<img src="https://user-images.githubusercontent.com/3756229/208230355-3be98e20-1dfe-48c4-9fb3-9f7d7eff97d0.png" width="80%">


<details>
  <summary><b><h5>Sample console log: "run worker for MINA/USD price @16/12/22" </h3></b></summary>

  
* See [Deploy](#deploy-to-berkeley-network) or Use PublicKey: [B62qj1dQSJNbaLnFobM2US3dnC7c7Wpd7m5UNS98AwBPiRMiWD6Th1j](https://berkeley.minaexplorer.com/wallet/B62qj1dQSJNbaLnFobM2US3dnC7c7Wpd7m5UNS98AwBPiRMiWD6Th1j)
  
```

OCW: SnarkyJS loaded
Using fee payer account with nonce 16, balance 45600000000
Compiling smart contract...
warning: using a `utils.ts` written before `isProved` made available. Check https://docs.minaprotocol.com/zkapps/tutorials/deploying-to-a-live-network for updates
OCW: current value of roundId is 7
Creating an execution proof...
creating proof took 41.937 seconds
Sending the transaction...
See transaction at https://berkeley.minaexplorer.com/transaction/CkpZXjwhrjELZE4LV8MxitPTwmwy8TPp1L1aMeqNPmy8kFnqYKdVR
waiting for zkApp state to change... (current state:  7)
......................
OCW: current value of roundId is 8
request https://min-api.cryptocompare.com/data/pricemultifull?fsyms=MINA&tsyms=USD
      - offchain-value 'RAW.MINA.USD.PRICE' = 0.493
      - onchain-value 'RAW.MINA.USD.PRICE' = 0.493
Creating an execution proof...
creating proof took 41.357 seconds
Sending the transaction...
See transaction at https://berkeley.minaexplorer.com/transaction/CkpZ3h6QXArsYe1JGgcG1xmZqTm3tzDF2q8J5fdxHYipVfdv9UFk6
waiting for zkApp state to change... (current state:  490)
............................................................

```
  
</details>

### [Demo](https://youtu.be/6cmeeP_Uw4Y) -- 13 min

-----------------

## Testing on LocalBlockchain

* Build ["OffchainOracle"](https://github.com/ubinix-warun/zkOracle-OCW/blob/main/contracts/src/OffchainOracle.ts), ["OffchainOracleLocal"](https://github.com/ubinix-warun/zkOracle-OCW/blob/main/contracts/src/OffchainOracleLocal.ts) contract.

```
cd zkOracle-OCW/contracts
npm run build
```

* Run [offchain-price-signer](https://github.com/ubinix-warun/zkOracle-OCW/tree/main/backends/offchain-price-signer) server on localhost.

```
cd zkOracle-OCW/backends/offchain-price-signer
npm install
npm run start
```

* Run [test-script](https://github.com/ubinix-warun/zkOracle-OCW/blob/main/contracts/src/OffchainOracleLocal.test.ts), call contract and simulate operator.

```
cd zkOracle-OCW/contracts
npm run test
```

#### Test results: 6 passed, 6 total

  
```

 PASS  src/OffchainOracleLocal.test.ts (101.53 s)
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
  <summary><b><h5>Sample test case: Call price-signer, feed MINA price to on chain.</h3></b></summary>

```
    ...
    
    const response = await fetch('http://localhost:3000/MINA/0');
    const data = await response.json();

    const roundId = Field(data.data.roundId); // First round's Zero
    const priceData = Field(data.data.price.onchain);
    const signature = Signature.fromJSON(data.signature);

    // Operator call feed fn, fetch 'newFeeddata' event.
    const txnFeed = await Mina.transaction(deployerAccount, () => {
      zkAppInstance.feed(
        roundId,
        priceData,
        signature ?? fail('something is wrong with the signature')
      );
    });
    await txnFeed.prove();
    await txnFeed.send();
    
    const eventsFeed = await zkAppInstance.fetchEvents();
    expect(eventsFeed[0].type).toEqual('newFeedData');
    
    ...
    
```

</details>


## Deploy to Berkeley Network

* Setting berkeley network via zk-cli.

```
cd zkOracle-OCW/contracts
zk config

-- Name: berkeley
-- URL: https://proxy.berkeley.minaexplorer.com/graphql
-- Fee: 0.1

```

* Deploy OffchainOracle to Berkeley network.

```
zk deploy

...

  ┌────────────────┬─────────────────────────────────────────────────┐
  │ Network        │ berkeley                                        │
  ├────────────────┼─────────────────────────────────────────────────┤
  │ Url            │ https://proxy.berkeley.minaexplorer.com/graphql │
  ├────────────────┼─────────────────────────────────────────────────┤
  │ Smart Contract │ OffchainOracle                                  │
  └────────────────┴─────────────────────────────────────────────────┘
  

```

* PublicKey: [B62qj1dQSJNbaLnFobM2US3dnC7c7Wpd7m5UNS98AwBPiRMiWD6Th1j](https://berkeley.minaexplorer.com/wallet/B62qj1dQSJNbaLnFobM2US3dnC7c7Wpd7m5UNS98AwBPiRMiWD6Th1j)


## Credit

* [MINA Protocol](https://minaprotocol.com/) - Mina is building the privacy and security layer for web3.
* [mina-credit-score-signer](https://github.com/jackryanservia/mina-credit-score-signer) - Koa API that signs a specified user’s fake credit score with a Mina compatible signature scheme.
* [chainlink-polkadot](https://github.com/smartcontractkit/chainlink-polkadot/tree/master/pallet-chainlink) - This pallet allows your substrate built parachain/blockchain to interract with chainlink. 
