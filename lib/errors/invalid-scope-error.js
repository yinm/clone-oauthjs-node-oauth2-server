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
 * "The requested scope is invalid, unknown, or malformed."
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */

function InvalidScopeError(message, properties) {
  properties = _.assign({
    code: 400,
    name: 'invalid_scope'
  }, properties)

  OAuthError.call(this, message, properties)
}

/**
 * Inherit prototype.
 */

util.inherits(InvalidScopeError, OAuthError)

/**
 * Export constructor.
 */

module.exports = InvalidScopeError
