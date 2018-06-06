'use strict'

/**
 * Module dependencies.
 */

const AbstractGrantType = require('./abstract-grant-type')
const InvalidArgumentError = require('../errors/invalid-argument-error')
const InvalidGrantError = require('../errors/invalid-grant-error')
const InvalidRequestError = require('../errors/invalid-request-error')
const Promise = require('bluebird')
const promisify = require('promisify-any').use(Promise)
const ServerError = require('../errors/server-error')
const is = require('../validator/is ')
const util = require('util')

/**
 * Constructor.
 */

function RefreshTokenGrantType(options) {
  options = options || {}

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  if (!options.model.getRefreshToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getRefreshToken()`')
  }

  if (!options.model.revokeToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `revokeToken()`')
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`')
  }

  AbstractGrantType.call(this, options)
}

/**
 * Inherit prototype.
 */

util.inherits(RefreshTokenGrantType, AbstractGrantType)

/**
 * Handle refresh token grant.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-6
 */

RefreshTokenGrantType.prototype.handle = function(request, client) {
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`')
  }

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`')
  }

  return Promise.bind(this)
    .then(function() {
      return this.getRefreshToken(request, client)
    })
    .tap(function(token) {
      return this.revokeToken(token)
    })
    .then(function(token) {
      return this.saveToken(token.user, client, token.scope)
    })
}

/**
 *
 */

/**
 *
 */

/**
 *
 */

/**
 *
 */
