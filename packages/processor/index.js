'use strict'

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const GrapeHandler = require('./handler')

// if (process.argv.length < 3) {
//   console.log('missing a validator address')
//   process.exit(1)
// }
//
// console.log('checking if this works')
//
// const address = process.argv[2]

const transactionProcessor = new TransactionProcessor('tcp://validator:4004')

transactionProcessor.addHandler(new GrapeHandler())

transactionProcessor.start()

console.log('AGAIN: checking if this works')
