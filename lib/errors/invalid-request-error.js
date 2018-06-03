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
 * "The request is missing a required parameter, includes an invalid parameter value,
 * includes a parameter more than once, or is otherwise malformed.
 */

function InvalidRequest(message, properties) {
  properties = _.assign({
    code: 400,
    name: 'invalid_request'
  }, properties)

  OAuthError.call(this, message, properties)
}

/**
 * Inherit prototype.
 */

util.inherits(InvalidRequest, OAuthError)

/**
 * Export constructor.
 */

module.exports = InvalidRequest
