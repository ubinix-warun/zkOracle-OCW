import { OffchainOracle } from './OffchainOracle';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  Signature,
} from 'snarkyjs';

import { JSONPath } from 'jsonpath-plus';

// The public key of our trusted data provider
import key from '../scripts/key.json';
const ORACLE_PUBLIC_KEY = key.publicKey;

let proofsEnabled = false;
function createLocalBlockchain() {
  const Local = Mina.LocalBlockchain({ proofsEnabled });
  Mina.setActiveInstance(Local);
  return Local.testAccounts[0].privateKey;
}

async function localDeploy(
  zkAppInstance: OffchainOracle,
  zkAppPrivatekey: PrivateKey,
  deployerAccount: PrivateKey
) {
  const txn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy({ zkappKey: zkAppPrivatekey });
    zkAppInstance.init(zkAppPrivatekey);
  });
  await txn.prove();
  txn.sign([zkAppPrivatekey]);
  await txn.send();
}

describe('OffchainOracle', () => {
  let deployerAccount: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey;

  beforeAll(async () => {
    await isReady;
    if (proofsEnabled) OffchainOracle.compile();
  });

  beforeEach(async () => {
    deployerAccount = createLocalBlockchain();
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
  });

  afterAll(async () => {
    // `shutdown()` internally calls `process.exit()` which will exit the running Jest process early.
    // Specifying a timeout of 0 is a workaround to defer `shutdown()` until Jest is done running all tests.
    // This should be fixed with https://github.com/MinaProtocol/mina/issues/10943
    setTimeout(shutdown, 0);
  });

  it('generates and deploys the `OffchainOracle` smart contract', async () => {
    const zkAppInstance = new OffchainOracle(zkAppAddress);
    await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);
    const oraclePublicKey = zkAppInstance.oraclePublicKey.get();
    expect(oraclePublicKey).toEqual(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
  });

  describe('actual API requests', () => {
    it('create nextRound event for demo ofw (Off-chain worker)', async () => {
      const zkAppInstance = new OffchainOracle(zkAppAddress);
      await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

      const privateKey = PrivateKey.fromBase58(
        process.env.PRIVATE_KEY ?? key.privateKey
      );

      const roundId = await zkAppInstance.roundId.get();

      const signatureNextRound = Signature.create(privateKey, [roundId]);

      const txnNextRound = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.nextRound(
          signatureNextRound ?? fail('something is wrong with the signature')
        );
      });
      await txnNextRound.prove();
      await txnNextRound.send();

      const eventsNextRound = await zkAppInstance.fetchEvents();

      expect(eventsNextRound[0].type).toEqual('nextRound');
      expect(zkAppInstance.roundId.get().toBigInt()).toEqual(
        roundId.toBigInt() + 1n
      ); // check nextRound value was updated.
    });

    it('call feed Data for demo ofw (Off-chain worker)', async () => {
      const zkAppInstance = new OffchainOracle(zkAppAddress);
      await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);

      const priceUrl =
        'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD';
      const pricePath = 'RAW.ETH.USD.PRICE';

      const response = await fetch(priceUrl);
      const data = await response.json();
      const result = JSONPath({ path: pricePath, json: data });
      const r100 = Math.floor((result[0] * 100) as number);

      const privateKey = PrivateKey.fromBase58(
        process.env.PRIVATE_KEY ?? key.privateKey
      );

      const roundId = Field(0); // First round's Zero
      const signatureFeed = Signature.create(privateKey, [
        roundId,
        Field(r100),
      ]);

      const txnFeed = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.feed(
          roundId,
          Field(r100),
          signatureFeed ?? fail('something is wrong with the signature')
        );
      });
      await txnFeed.prove();
      await txnFeed.send();

      const eventsFeed = await zkAppInstance.fetchEvents();
      expect(eventsFeed[0].type).toEqual('newFeedData');

      const feedData = await zkAppInstance.feedData.get();
      expect(feedData).toEqual(Field(r100));

      console.log(`request ${priceUrl}
       - offchain-value '${pricePath}' = ${r100 / 100}
       - onchain-value '${pricePath}' = ${Number(feedData.toBigInt()) / 100}`);
    });
  });
});
