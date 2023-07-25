"use strict";

const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");
const { TextDecoder } = require("text-encoding/lib/encoding");

const decoder = new TextDecoder("utf8");

class GrapePayload {
  constructor(action, body) {
    this.action = action;
    this.body = body;
  }

  // payload should look like: 'push|{"key": "value"}'
  static fromBytes(payload) {
    payload = decoder.decode(payload).toString().split("|");
    if (payload.length === 2) {
      let grapePayload = new GrapePayload(payload[0], payload[1]);
      if (!grapePayload.action) {
        throw new InvalidTransaction("action is required");
      }
      if (!grapePayload.body) {
        throw new InvalidTransaction("action body is required");
      }
      return grapePayload;
    } else {
      throw new InvalidTransaction("invalid payload serialization");
    }
  }
}

module.exports = GrapePayload;
