"use strict";

const crypto = require("crypto");
const { TextEncoder, TextDecoder } = require("text-encoding/lib/encoding");

const encoder = new TextEncoder("utf8");
const decoder = new TextDecoder("utf8");

class GrapeState {
  constructor(context) {
    this.context = context;
    this.timeout = 500;
  }

  // entry should be of type Eliability[]
  pushToStore(payload, publicKey) {
    const address = _makeGrapeAddress(publicKey);

    return this.context
      .getState([address])
      .then((s) => {
        if (s[address]) {
          let state =
            s[address].length === 0
              ? []
              : JSON.parse(decoder.decode(s[address]));
          console.log("old state: ", state);

          state = JSON.stringify([...state, JSON.parse(payload.body)]);
          console.log("new state: ", state);

          const entries = {
            [address]: encoder.encode(state),
          };

          return this.context.setState(entries);
        }
      })
      .catch((err) => console.log("error writing to state: ", err));
  }
}

const _hash = (x) =>
  crypto
    .createHash("sha512")
    .update(x)
    .digest("hex")
    .toLowerCase()
    .substring(0, 64);

const GRAPE_FAMILY = "grape";

const GRAPE_NAMESPACE = _hash(GRAPE_FAMILY).substring(0, 6);

const _makeGrapeAddress = (x) => GRAPE_NAMESPACE + _hash(x);

module.exports = {
  GRAPE_FAMILY,
  GRAPE_NAMESPACE,
  GrapeState,
};
