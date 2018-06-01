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
 *
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
