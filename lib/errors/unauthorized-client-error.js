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
 * "The authenticated client is not authorized to use this authorization grant type."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */

function UnauthorizedClientError(message, properties) {
  properties = _.assign({
    code: 400,
    name: 'unauthorized_client'
  }, properties)

  OAuthError.call(this, message, properties)
}

/**
 * Inherit prototype.
 */

util.inherits(UnauthorizedClientError, OAuthError)

/**
 * Export constructor.
 */

module.exports = UnauthorizedClientError
