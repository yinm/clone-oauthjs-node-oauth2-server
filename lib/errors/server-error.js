'use strict'

/**
 * Module dependencies.
 */

const _ = require('lodash')
const OAuthError = require('./oauth-error')
const util = require('util')

/**
 * Constructor.
 *
 * "The authorization server encountered an unexpected condition that prevented it from fulfilling the request."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */

function ServerError(message, properties) {
  properties = _.assign({
    code: 503,
    name: 'server_error'
  }, properties)

  OAuthError.call(this, message, properties)
}

/**
 * Inherit prototype.
 */

util.inherits(ServerError, OAuthError)

/**
 * Export constructor.
 */

module.exports = ServerError
