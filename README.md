# zkOracle and Off-chain worker

the zkApps Hackathon -- [zkIgnite, Cohort 0 Begins](https://minaprotocol.com/blog/zkignite-cohort0)
> [Oracles on Mina](https://minaprotocol.com/blog/10-zkapps-use-cases-on-mina-protocol) -- authenticated data from any HTTPS website available on chain.

The zkOracle/Off-chain worker for MINA protocol, Feed On-chain Data with Worker. <br/>
Such as, ETH price, MINA or DOT from External API.

<img src="https://user-images.githubusercontent.com/3756229/207847614-fca0c6b0-13eb-422c-8322-121730359ef1.png" width="80%">

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

## Demo.

Soon...

## Testing on LocalBlockchain

* Build ["OffchainOracle"](https://github.com/ubinix-warun/zkOracle-OCW/blob/main/contracts/src/OffchainOracle.ts) contract.

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

* Run [test-script](https://github.com/ubinix-warun/zkOracle-OCW/blob/main/contracts/src/OffchainOracle.test.ts), call contract and simulate operator.

```
cd zkOracle-OCW/contracts
npm run test
```

#### Sample test case: Call price-signer, feed MINA price to on chain.

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

<details>
  <summary><b><h5>Test results: 6 passed, 6 total</h3></b></summary>
  
```

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

```

PublicKey: <>


## Credit

* [MINA Protocol](https://minaprotocol.com/) - Mina is building the privacy and security layer for web3.
* [mina-credit-score-signer](https://github.com/jackryanservia/mina-credit-score-signer) - Koa API that signs a specified user’s fake credit score with a Mina compatible signature scheme.
* [chainlink-polkadot](https://github.com/smartcontractkit/chainlink-polkadot/tree/master/pallet-chainlink) - This pallet allows your substrate built parachain/blockchain to interract with chainlink. 
