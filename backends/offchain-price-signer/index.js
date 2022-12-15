const Koa = require("koa");
const Router = require("@koa/router");
const { isReady, PrivateKey, Field, Signature } = require("snarkyjs");
const { JSONPath } = require("jsonpath-plus");

const PORT = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();

async function getSignedPriceInUSD(symbol, roundId) {
  // We need to wait for SnarkyJS to finish loading before we can do anything
  await isReady;

  // Request API from cryptocompare for ${symbol} price.
  const priceUrl =
  `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD`;
  const pricePath = `RAW.${symbol}.USD.PRICE`;

  const response = await fetch(priceUrl);
  const data = await response.json();
  const result = JSONPath({ path: pricePath, json: data });


  // The private key of our account. When running locally the hardcoded key will
  // be used. In production the key will be loaded from a Vercel environment
  // variable.
  const privateKey = PrivateKey.fromBase58(
    process.env.PRIVATE_KEY ??
      "EKF65JKw9Q1XWLDZyZNGysBbYG21QbJf3a4xnEoZPZ28LKYGMw53"
  );

  // We get the ${symbol} price.
  const knownPriceInUSD = result[0];
  const knownPriceInUSDx100 = Math.floor((knownPriceInUSD * 100));
  // NOTE: x100 store float on-chain (Field).

  // We compute the public key associated with our private key
  const publicKey = privateKey.toPublicKey();

  // Define a Field with the value of the users id
  const roundIdField = Field(roundId);

  // Define a Field with the ETH price
  const priceField = Field(knownPriceInUSDx100);

  // Use our private key to sign an array of Fields containing the round id and
  // price InUSD
  const signature = Signature.create(privateKey, [
    roundIdField, 
    priceField,
  ]);

  return {
    data: { 
      roundId: roundId, 
      price: {
        offchain: knownPriceInUSD,
        onchain: knownPriceInUSDx100,
      }
    },
    signature: signature,
    publicKey: publicKey,
  };
}

router.get("/:symbol/:roundId", async (ctx) => {
  ctx.body = await getSignedPriceInUSD(ctx.params.symbol, ctx.params.roundId);
});

app.use(router.routes()).use(router.allowedMethods());

console.log(`offchain-price signer -- listen :${PORT}`);
app.listen(PORT);
