'use strict'

/**
 * Module dependencies.
 */

const InvalidArgumentError = require('../errors/invalid-argument-error')
const InvalidRequestError = require('../errors/invalid-request-error')
const InsufficientScopeError = require('../errors/insufficient-scope-error')
const InvalidTokenError = require('../errors/invalid-token-error')
const OAuthError = require('../errors/oauth-error')
const Promise = require('bluebird')
const promisify = require('promisify-any').use(Promise)
const Request = require('../request')
const Response = require('../response')
const ServerError = require('../errors/server-error')
const UnauthorizedRequestError = require('../errors/unauthorized-request-error')

/**
 * Constructor.
 */

function AuthenticateHandler(options) {
  options = options || {}

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  if (!options.model.getAccessToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getAccessToken()`')
  }

  if (options.scope && undefined === options.addAcceptedScopesHeader) {
    throw new InvalidArgumentError('Missing parameter: `addAcceptedScopesHeader`')
  }

  if (options.scope && undefined === options.addAuthorizedScopesHeader) {
    throw new InvalidArgumentError('Missing parameter: `addAuthorizedScopesHeader`')
  }

  if (options.scope && !options.model.verifyScope) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `verifyScope()`')
  }

  this.addAcceptedScopesHeader = options.addAcceptedScopesHeader
  this.addAuthorizedScopesHeader = options.addAuthorizedScopesHeader
  this.allowBearerTokensInQueryString = options.allowBearerTokensInQueryString
  this.model = options.model
  this.scope = options.scope
}

/**
 * Authenticate Handler.
 */

AuthenticateHandler.prototype.handle = function(request, response) {
  if (!(request instanceof Request)) {
    throw new InvalidArgumentError('Invalid argument: `request` must be an instance of Request')
  }

  if (!(response instanceof Response)) {
    throw new InvalidArgumentError('Invalid argument: `response` must be an instance of Response')
  }

  return Promise.bind(this)
    .then(function() {
      return this.getTokenFromRequest(request)
    })
    .then(function(token) {
      return this.getAccessToken(token)
    })
    .tap(function(token) {
      return this.validateAccessToken(token)
    })
    .tap(function(token) {
      if (!this.scope) {
        return
      }

      return this.verifyScope(token)
    })
    .tap(function(token) {
      return this.updateResposne(response, token)
    })
    .catch(function(e) {
      // Include the "WWW-Authenticate" response header field in the client
      // lacks any authentication information.
      //
      // @see https://tools.ietf.org/html/rfc6750#section-3.1
      if (e instanceof UnauthorizedRequestError) {
        response.set('WWW-Authenticate', 'Bearer realm="Service"')
      }

      if (!(e instanceof OAuthError)) {
        throw new ServerError(e)
      }

      throw e
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

/**
 *
 */

/**
 *
 */
