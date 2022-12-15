# Offchain Price Signer

Koa API that signs a specified price with a Mina compatible signature scheme.

>> http://{ENDPOINT}:{PORT}/:symbol/:roundId

* symbol "ETH", "MINA", "DOT"
* roundId 1, 2 ...

## Setup & Run 'Offchain Price Signer'

```
npm install
npm run start


> offchain-price-signer@1.0.0 start
> node index.js

offchain-price signer -- listen :3000

```

![image](https://user-images.githubusercontent.com/3756229/207772240-03a9359d-66c7-4721-bd6f-5d1cbfd4a7dc.png)
