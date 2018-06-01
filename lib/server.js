'use strict'

/**
 * Module dependencies.
 */

const _ = require('lodash')
const AuthenticateHandler = require('./handlers/authenticate-handler')
const AuthorizeHandler = require('./handlers/authorize-handler')
const InvalidArgumentError = require('./errors/invalid-argument-error')
const TokenHandler = require('./handlers/token-handler')

/**
 * Constructor.
 */

function Oauth2Server(options) {
  options = options || {}

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  this.options = options
}

/**
 * Authenticate a token.
 */

Oauth2Server.prototype.authenticate = function(request, response, options, callback) {
  if (typeof options === 'string') {
    options = {scope: options}
  }

  options = _.assign({
    addAcceptedScopesHeader: true,
    addAuthorizedScopesHeader: true,
    allowBearerTokensInQueryString: false
  }, this.options, options)

  return new AuthenticateHandler(options)
    .handle(request, response)
    .nodeify(callback)
}

/**
 * Authorize a request.
 */

Oauth2Server.prototype.authorize = function(request, response, options, callback) {
  options = _.assign({
    allowEmptyState: false,
    authorizationCodeLifetime: 5 * 60 // 5 minutes.
  }, this.options, options)

  return new AuthorizeHandler(options)
    .handle(request, response)
    .nodeify(callback)
}

/**
 * Create a token.
 */

Oauth2Server.prototype.token = function(request, response, options, callback) {
  options = _.assign({
    accessTokenLifetime: 60 * 60, // 1 hour.
    refreshTokenLifetime: 60 * 60 * 24 * 14, // 2 weeks.
    allowExtendedTokenAttributes: false,
    requireClientAuthentication: {} // defaults to true for all grant types
  }, this.options, options)

  return new TokenHandler(options)
    .handle(request, response)
    .nodeify(callback)
}

/**
 * Export constructor.
 */

module.exports = Oauth2Server
