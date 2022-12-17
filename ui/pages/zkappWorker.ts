import {
  Mina,
  isReady,
  PublicKey,
  PrivateKey,
  Field,
  fetchAccount,
} from 'snarkyjs'

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { OffchainOracle } from '../../contracts/src/OffchainOracle';

const state = {
  OffchainOracle: null as null | typeof OffchainOracle,
  zkapp: null as null | OffchainOracle,
  transaction: null as null | Transaction,
}

// ---------------------------------------------------------------------------------------

const functions = {
  loadSnarkyJS: async (args: {}) => {
    await isReady;
  },
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.BerkeleyQANet(
      "https://proxy.berkeley.minaexplorer.com/graphql"
    );
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { OffchainOracle } = await import('../../contracts/build/src/OffchainOracle.js');
    state.OffchainOracle = OffchainOracle;
  },
  compileContract: async (args: {}) => {
    await state.OffchainOracle!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.OffchainOracle!(publicKey);
  },
  getRoundId: async (args: {}) => {
    const roundId = await state.zkapp!.roundId.get();
    return JSON.stringify(roundId.toJSON());
  },  
  getFeedData: async (args: {}) => {
    const feedData = await state.zkapp!.feedData.get();
    return JSON.stringify(feedData.toJSON());
  },
  createUpdateTransaction: async (args: {}) => {
    // const transaction = await Mina.transaction(() => {
    //     state.zkapp!.update();
    //   }
    // );
    // state.transaction = transaction;
  },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number,
  fn: WorkerFunctions,
  args: any
}

export type ZkappWorkerReponse = {
  id: number,
  data: any
}
if (process.browser) {
  addEventListener('message', async (event: MessageEvent<ZkappWorkerRequest>) => {
    const returnData = await functions[event.data.fn](event.data.args);

    const message: ZkappWorkerReponse = {
      id: event.data.id,
      data: returnData,
    }
    postMessage(message)
  });
}
