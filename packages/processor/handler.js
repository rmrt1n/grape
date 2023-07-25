"use strict";

const { TransactionHandler } = require("sawtooth-sdk/processor/handler");
const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");

const { GRAPE_NAMESPACE, GRAPE_FAMILY, GrapeState } = require("./state");
const GrapePayload = require("./payload");

class GrapeHandler extends TransactionHandler {
  constructor() {
    super(GRAPE_FAMILY, ["1.0"], [GRAPE_NAMESPACE]);
    console.log("GRAPE HANDLER CLASS INITALIZED");
  }

  apply(transactionProcessRequest, context) {
    let payload = GrapePayload.fromBytes(transactionProcessRequest.payload);
    let state = new GrapeState(context);
    let header = transactionProcessRequest.header;
    let signer = header.signerPublicKey;

    if (payload.action === "push") {
      return state.pushToStore(payload, signer);
    } else {
      throw new InvalidTransaction(
        `action must be push, not ${payload.action}`
      );
    }
  }
}

module.exports = GrapeHandler;
