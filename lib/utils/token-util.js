'use strict'

/**
 * Module dependencies.
 */

const crypto = require('crypto')
const randomBytes = require('bluebird').promisify(require('crypto').randomBytes)

/**
 * Export `TokenUtil`.
 */

module.exports = {

  /**
   * Generate random token.
   */

  generateRandomToken() {
    return randomBytes(256)
      .then(buffer => {
        return crypto
          .createHash('sha1')
          .update(buffer)
          .digest('hex')
      })
  }
}

