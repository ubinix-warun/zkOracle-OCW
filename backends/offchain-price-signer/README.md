# Offchain Price Signer

Koa API that signs a specified price with a Mina compatible signature scheme.

>> http://{ENDPOINT}:{PORT}/:symbol/:roundId

* symbol "ETH", "MINA", "DOT"
* roundId 1, 2 ...

## Setup & Run 'Offchain Price Signer'

```
npm install
npm run start

```
## Testing 

* After service on listen, Get offchain/onchain price.

```
> offchain-price-signer@1.0.0 start
> node index.js

offchain-price signer -- listen :3000

```

* Use HTTP GET to the URL and scale float to bigint value for store on-chain.
>> p_onchain = floor(p_offchain * 100)

![image](https://user-images.githubusercontent.com/3756229/207772240-03a9359d-66c7-4721-bd6f-5d1cbfd4a7dc.png)

## Credit

* [MINA Protocol](https://minaprotocol.com/) - Mina is building the privacy and security layer for web3.
* [mina-credit-score-signer](https://github.com/jackryanservia/mina-credit-score-signer) - Koa API that signs a specified user’s fake credit score with a Mina compatible signature scheme.
* [Koa API Server](https://koajs.com/) - Koa is a new web framework designed by the team behind Express.