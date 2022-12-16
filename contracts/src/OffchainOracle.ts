import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PublicKey,
  Signature,
  // PrivateKey,
} from 'snarkyjs';

// The public key of our trusted data provider
const ORACLE_PUBLIC_KEY =
  'B62qj1dQSJNbaLnFobM2US3dnC7c7Wpd7m5UNS98AwBPiRMiWD6Th1j';

export class OffchainOracle extends SmartContract {
  // Define contract state
  @state(PublicKey) oraclePublicKey = State<PublicKey>();
  @state(Field) roundId = State<Field>();
  @state(Field) feedData = State<Field>();

  // Define contract events
  events = {
    nextRound: Field,
    newFeedData: Field,
  };

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
    // Initialize contract state
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    this.roundId.set(Field(0));
    this.feedData.set(Field(0));
  }

  @method nextRound(signature: Signature) {
    // Get the oracle public key from the contract state
    const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey);
    // Get the oracle roundId from the contract state
    const roundId = this.roundId.get();
    this.roundId.assertEquals(roundId);
    // Evaluate whether the signature is valid for the provided data
    const validSignature = signature.verify(oraclePublicKey, [roundId]);
    // Check that the signature is valid
    validSignature.assertTrue();
    // // Trig '' on chain
    this.roundId.set(roundId.add(1)); // roundId++
    // // Emit an event containing the nextRound
    this.emitEvent('nextRound', this.roundId.get());
  }

  @method feed(roundId: Field, feedData: Field, signature: Signature) {
    // Get the oracle public key from the contract state
    const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey);
    // Check the oracle roundId from the contract state
    this.roundId.assertEquals(roundId);
    // Evaluate whether the signature is valid for the provided data
    const validSignature = signature.verify(oraclePublicKey, [
      roundId,
      feedData,
    ]);
    // Check that the signature is valid
    validSignature.assertTrue();
    // Store feedData on chain
    this.feedData.set(feedData);
    // Emit an event containing the newFeedData
    this.emitEvent('newFeedData', roundId);
  }
}
