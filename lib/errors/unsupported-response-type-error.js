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
 * "The authorization server does not support obtaining an
 * authorization code using this method."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */

function UnsupportedResponseTypeError(message, properties) {
  properties = _.assign({
    code: 400,
    name: 'unsupported_response_type'
  }, properties)

  OAuthError.call(this, message, properties)
}

/**
 * Inherit prototype.
 */

util.inherits(UnsupportedResponseTypeError, OAuthError)

/**
 * Export constructor.
 */

module.exports = UnsupportedResponseTypeError
