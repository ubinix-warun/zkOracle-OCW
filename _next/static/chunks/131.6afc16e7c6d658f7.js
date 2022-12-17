"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[131],{

/***/ 3131:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OffchainOracle": function() { return /* binding */ OffchainOracle; }
/* harmony export */ });
/* harmony import */ var snarkyjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6400);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// The public key of our trusted data provider
const ORACLE_PUBLIC_KEY = 'B62qj1dQSJNbaLnFobM2US3dnC7c7Wpd7m5UNS98AwBPiRMiWD6Th1j';
class OffchainOracle extends snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .SmartContract */ .C3 {
    constructor() {
        super(...arguments);
        // Define contract state
        this.oraclePublicKey = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .State */ .ZM)();
        this.roundId = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .State */ .ZM)();
        this.feedData = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .State */ .ZM)();
        // Define contract events
        this.events = {
            nextRound: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN,
            newFeedData: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN,
        };
    }
    deploy(args) {
        super.deploy(args);
        this.setPermissions({
            ...snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Permissions["default"] */ .Pl["default"](),
            editState: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Permissions.proofOrSignature */ .Pl.proofOrSignature(),
        });
        // Initialize contract state
        this.oraclePublicKey.set(snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey.fromBase58 */ .nh.fromBase58(ORACLE_PUBLIC_KEY));
        this.roundId.set((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0));
        this.feedData.set((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0));
    }
    nextRound(signature) {
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
    feed(roundId, feedData, signature) {
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
__decorate([
    (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .state */ .SB)(snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .PublicKey */ .nh),
    __metadata("design:type", Object)
], OffchainOracle.prototype, "oraclePublicKey", void 0);
__decorate([
    (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .state */ .SB)(snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN),
    __metadata("design:type", Object)
], OffchainOracle.prototype, "roundId", void 0);
__decorate([
    (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .state */ .SB)(snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN),
    __metadata("design:type", Object)
], OffchainOracle.prototype, "feedData", void 0);
__decorate([
    snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .method */ .UD,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Signature */ .Pc]),
    __metadata("design:returntype", void 0)
], OffchainOracle.prototype, "nextRound", null);
__decorate([
    snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .method */ .UD,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN, snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Signature */ .Pc]),
    __metadata("design:returntype", void 0)
], OffchainOracle.prototype, "feed", null);
//# sourceMappingURL=OffchainOracle.js.map

/***/ })

}]);