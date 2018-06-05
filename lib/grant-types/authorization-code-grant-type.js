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
const is = require('../validator/is')
const util = require('util')

/**
 * Constructor.
 */

function AuthorizationCodeGrantType(options) {
  options = options || {}

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  if (!options.model.getAuthorizationCode) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getAuthorizationCode()`')
  }

  if (!options.model.revokeAuthorizationCode) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `revokeAuthorizationCode()`')
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`')
  }

  AbstractGrantType.call(this, options)
}

/**
 * Inherit prototype.
 */

util.inherits(AuthorizationCodeGrantType, AbstractGrantType)

/**
 * Handle authorization code grant.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.1.3
 */

AuthorizationCodeGrantType.prototype.handle = function(request, client) {
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`')
  }

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`')
  }

  return Promise.bind(this)
    .then(function() {
      return this.getAuthorizationCode(request, client)
    })
    .tap(function(code) {
      return this.validateRedirectUri(request, code)
    })
    .tap(function(code) {
      return this.revokeAuthorizationCode(code)
    })
    .then(function(code) {
      return this.saveToken(code.user, client, code.authorizationCode, code.scope)
    })
}

/**
 * Get the authorization code.
 */

AuthorizationCodeGrantType.prototype.getAuthorizationCode = function(request, client) {
  if (!request.body.code) {
    throw new InvalidRequestError('Missing parameter: `code`')
  }

  if (!is.vschar(request.body.code)) {
    throw new InvalidRequestError('Invalid parameter: `code`')
  }

  return promisify(this.model.getAuthorizationCode, 1).call(this.model, request.body.code)
    .then(function(code) {
      if (!code) {
        throw new InvalidGrantError('Invalid grant: authorization code is invalid')
      }

      if (!code.client) {
        throw new ServerError('Server error: `getAuthorizationCode()` did not return a `client` object')
      }

      if (!code.user) {
        throw new ServerError('Server error: `getAuthorizationCode()` did not return a `user` object')
      }

      if (code.client.id !== client.id) {
        throw new InvalidGrantError('Invalid grant: authorization code is invalid')
      }

      if (!(code.expiresAt instanceof Date)) {
        throw new ServerError('Server error: `expiresAt` must be a Date instance')
      }

      if (code.expiresAt < new Date()) {
        throw new InvalidGrantError('Invalid grant: authorization code has expired')
      }

      if (code.redirectUri && !is.uri(code.redirectUri)) {
        throw new InvalidGrantError('Invalid grant: `redirect_uri` is not a valid URI')
      }

      return code
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

/**
 *
 */