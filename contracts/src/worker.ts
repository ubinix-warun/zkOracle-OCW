import { OffchainOracle } from './OffchainOracle.js';
import {
  isReady,
  shutdown,
  Mina,
  Field,
  PrivateKey,
  // fetchAccount,
  Signature,
} from 'snarkyjs';

import {
  loopUntilAccountExists,
  makeAndSendTransaction,
  zkAppNeedsInitialization,
  // accountExists
} from './utils.js';
import fs from 'fs';

import { JSONPath } from 'jsonpath-plus';

(async function main() {
  await isReady;

  console.log('OCW: SnarkyJS loaded');

  // ----------------------------------------------------

  const Berkeley = Mina.BerkeleyQANet(
    'https://proxy.berkeley.minaexplorer.com/graphql'
  );
  Mina.setActiveInstance(Berkeley);

  let transactionFee = 100_000_000;

  const deployerKeysFileContents = fs.readFileSync('scripts/key.json', 'utf8');

  let key = JSON.parse(deployerKeysFileContents);

  const deployerPrivateKeyBase58 = key.privateKey;

  const deployerPrivateKey = PrivateKey.fromBase58(deployerPrivateKeyBase58);

  // ----------------------------------------------------

  let account = await loopUntilAccountExists({
    account: deployerPrivateKey.toPublicKey(),
    eachTimeNotExist: () => {
      console.log(
        'Deployer account does not exist. ' +
          'Request funds at faucet ' +
          'https://faucet.minaprotocol.com/?address=' +
          deployerPrivateKey.toPublicKey().toBase58()
      );
    },
    isZkAppAccount: false,
  });

  console.log(
    `Using fee payer account with nonce ${account.nonce}, balance ${account.balance}`
  );

  // ----------------------------------------------------

  const zkAppPrivateKey = deployerPrivateKey;
  const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
  let zkapp = new OffchainOracle(zkAppPublicKey);

  console.log('Compiling smart contract...');
  await OffchainOracle.compile();

  let zkAppAccount = await loopUntilAccountExists({
    account: zkAppPrivateKey.toPublicKey(),
    eachTimeNotExist: () =>
      console.log('waiting for zkApp account to be deployed...'),
    isZkAppAccount: true,
  });

  const needsInitialization = await zkAppNeedsInitialization({ zkAppAccount });

  if (needsInitialization) {
    console.log('initializing smart contract');
    await makeAndSendTransaction({
      feePayerPrivateKey: deployerPrivateKey,
      zkAppPublicKey: zkAppPublicKey,
      mutateZkApp: () => zkapp.init(),
      transactionFee: transactionFee,
      getState: () => zkapp.roundId.get(),
      statesEqual: (num1, num2) => num1.equals(num2).toBoolean(),
    });
  }

  let roundId = (await zkapp.roundId.get())!;
  console.log('OCW: current value of roundId is', roundId.toString());

  try {
    for (;;) {
      // ----------------------------------------------------
      // Call first-round on SC,

      const signatureNextRound = Signature.create(zkAppPrivateKey, [roundId]);

      await makeAndSendTransaction({
        feePayerPrivateKey: deployerPrivateKey,
        zkAppPublicKey: zkAppPublicKey,
        mutateZkApp: () => zkapp.nextRound(signatureNextRound),
        transactionFee: transactionFee,
        getState: () => zkapp.roundId.get(),
        statesEqual: (num1, num2) => num1.equals(num2).toBoolean(),
      });

      roundId = (await zkapp.roundId.get())!;
      console.log('OCW: current value of roundId is', roundId.toString());

      // ----------------------------------------------------
      // Request Price and Feed data to on-chain

      const priceUrl =
        'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=MINA&tsyms=USD';
      const pricePath = 'RAW.MINA.USD.PRICE';

      const response = await fetch(priceUrl);
      const data = await response.json();
      const result = JSONPath({ path: pricePath, json: data });
      const r1000 = Math.floor((result[0] * 1000) as number);
      const feedData = Field(r1000);

      console.log(`request ${priceUrl}
      - offchain-value '${pricePath}' = ${r1000 / 1000}
      - onchain-value '${pricePath}' = ${Number(feedData.toBigInt()) / 1000}`);

      const signatureFeed = Signature.create(zkAppPrivateKey, [
        roundId,
        feedData,
      ]);

      await makeAndSendTransaction({
        feePayerPrivateKey: deployerPrivateKey,
        zkAppPublicKey: zkAppPublicKey,
        mutateZkApp: () => zkapp.feed(roundId, feedData, signatureFeed),
        transactionFee: transactionFee,
        getState: () => zkapp.feedData.get(),
        statesEqual: (num1, num2) => num1.equals(num2).toBoolean(),
      });

      let onChainData = (await zkapp.feedData.get())!;
      console.log('OCW: current value of roundId is', roundId.toString());
      console.log(
        'OCW: current value of MINA/USD is',
        Number(onChainData.toBigInt()) / 1000
      );
    }
  } catch (e) {
    console.log((e as Error).message);
  }

  // ----------------------------------------------------

  console.log('Shutting down');

  await shutdown();
})().catch((e) => console.log(e));
