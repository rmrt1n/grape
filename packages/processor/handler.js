const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const crypto = require('crypto')

const FAMILY_NAME = 'Grape'
const NAMESPACE = hash(FAMILY_NAME).substring(0, 6)

function hash(x) {
  return crypto.createHash('sha512').update(x).digest('hex').toLowerCase()
}

class GrapeHandler extends TransactionHandler {
  constructor() {
    super(FAMILY_NAME, ['1.0'], [NAMESPACE])
    console.log('grape handler class initalized')
  }

  apply(transactionProcessRequest, context) {
  }
}

module.exports = GrapeHandler
