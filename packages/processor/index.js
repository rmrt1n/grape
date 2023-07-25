"use strict";

const { TransactionProcessor } = require("sawtooth-sdk/processor");
const GrapeHandler = require("./handler");

if (process.argv.length < 3) {
  console.log("missing a validator address");
  process.exit(1);
}

const address = process.argv[2];
const transactionProcessor = new TransactionProcessor(address);

transactionProcessor.addHandler(new GrapeHandler());
transactionProcessor.start();

// IMPORTANT: don't add a console.log here to check if it starts. Doing so will for some reason
// break the transaction processor, and it won't handle any requests. smh
