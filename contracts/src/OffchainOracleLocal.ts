import { Field, method, PublicKey, PrivateKey } from 'snarkyjs';

import { OffchainOracle } from './OffchainOracle';

// The public key of our trusted data provider
import key from '../scripts/key.json'; // For Testing
const ORACLE_PUBLIC_KEY = key.publicKey;
// const ORACLE_PUBLIC_KEY = 'B62qj1dQSJNbaLnFobM2US3dnC7c7Wpd7m5UNS98AwBPiRMiWD6Th1j';

export class OffchainOracleLocal extends OffchainOracle {
  @method init(zkappKey: PrivateKey) {
    super.init(zkappKey);
    // Initialize contract state
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    this.roundId.set(Field(0));
    this.feedData.set(Field(0));
    // Specify that caller should include signature with tx instead of proof
    this.requireSignature();
  }
}
