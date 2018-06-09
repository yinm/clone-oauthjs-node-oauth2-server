'use strict'

/**
 * Module dependencies.
 */

const _ = require('lodash')
const AccessDeniedError = require('../errors/access-denied-error')
const AuthenticateHandler = require('./authenticate-handler')
const InvalidArgumentError = require('../errors/invalid-argument-error')
const InvalidClientError = require('../errors/invalid-client-error')
const InvalidRequestError = require('../errors/invalid-request-error')
const InvalidScopeError = require('../errors/invalid-scope-error')
const UnsupportedResponseTypeError = require('../errors/unsupported-response-type-error')
const OAuthError = require('../errors/oauth-error')
const Promise = require('bluebird')
const promisify = require('promisify-any').use(Promise)
const Request = require('../request')
const Response = require('../response')
const ServerError = require('../errors/server-error')
const UnauthorizedClientError = require('../errors/unauthorized-client-error')
const is = require('../validator/is')
const tokenUtil = require('../utils/token-util')
const url = require('url')

/**
 * Response types.
 */

const responseTypes = {
  code: require('../response-types/code-response-type')
}

/**
 * Constructor.
 */

function AuthorizeHandler(options) {
  options = options || {}

  if (options.authenticateHandler && !options.authenticateHandler.handle) {
    throw new InvalidArgumentError('Invalid argument: authenticateHandler does not implement `handle()`')
  }

  if (!options.authorizationCodeLifetime) {
    throw new InvalidArgumentError('Missing parameter: `authorizationCodeLifetime`')
  }

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  if (!options.model.getClient) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getClient()`')
  }

  if (!options.model.saveAuthorizationCode) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveAuthorizationCode()`')
  }

  this.allowEmptyState = options.allowEmptyState
  this.authenticateHandler = options.authenticateHandler || new AuthenticateHandler(options)
  this.authorizationCodeLifetime = options.authorizationCodeLifetime
  this.model = options.model
}

/**
 * Authorize Handler.
 */

AuthorizeHandler.prototype.handle = function(request, response) {
  if (!(request instanceof Request)) {
    throw new InvalidArgumentError('Invalid argument: `request` must be an instance of Request')
  }

  if (!(response instanceof Response)) {
    throw new InvalidArgumentError('Invalid argument: `response` must e an instance of Response')
  }

  if ('false' === request.query.allowed) {
    return Promise.reject(new AccessDeniedError('Access denied: user denied access to application'))
  }

  const fns = [
    this.getAuthorizationCode(),
    this.getClient(request),
    this.getUser(request, response)
  ]

  return Promise.all(fns)
    .bind(this)
    .spread(function(expiresAt, client, user) {
      const uri = this.getRedirectUri(request, client)
      let scope
      let state
      let ResponseType

      return Promise.bind(this)
        .then(function() {
          scope = this.getScope(request)

          return this.generateAuthorizationCode(client, user, scope)
        })
        .then(function(authorizationCode) {
          state = this.getState(request)
          ResponseType = this.getResponseType(request)

          return this.saveAuthorizationCode(authorizationCode, expiresAt, scope, client, uri, user)
        })
        .then(function(code) {
          const responseType = new ResponseType(code.authorizationCode)
          const redirectUri = this.buildSuccessRedirectUri(uri, responseType)

          this.updateResponse(response, redirectUri, state)

          return code
        })
        .catch(function(e) {
          if (!(e instanceof OAuthError)) {
            e = new ServerError(e)
          }
          const redirectUri = this.buildErrorRedirectUri(uri, e)

          this.updateResponse(response, redirectUri, state)

          throw e
        })
    })
}

/**
 * Generate authorization code.
 */

AuthorizeHandler.prototype.generateAuthorizationCode = function(client, user, scope) {
  if (this.model.generateAuthorizationCode) {
    return promisify(this.model.generateAuthorizationCode).call(this.model, client, user, scope)
  }

  return tokenUtil.generateRandomToken()
}

/**
 * Get atuhorization code lifetime.
 */

AuthorizeHandler.prototype.getAuthorizationCodeLifetime = function() {
  let expires = new Date()

  expires.setSeconds(expires.getSeconds() + this.authorizationCodeLifetime)
  return expires
}

/**
 * Get the client from the model.
 */

AuthorizeHandler.prototype.getClient = function(request) {
  const clientId = request.body.client_id || request.query.client_id

  if (!clientId) {
    throw new InvalidRequestError('Missing parameter: `client_id`')
  }

  if (!is.vschar(clientId)) {
    throw new InvalidRequestError('Invalid parameter: `client_id`')
  }

  const redirectUri = request.body.redirect_uri || request.query.redirect_uri

  if (redirectUri && !is.uri(redirectUri)) {
    throw new InvalidRequestError('Invalid request: `redirect_uri` is not a valid URI')
  }

  return promisify(this.model.getClient, 2).call(this.model, clientId, null)
    .then(function(client) {
      if (!client) {
        throw new InvalidClientError('Invalid client: client credentials are invalid')
      }

      if (!client.grants) {
        throw new InvalidClientError('Invalid client: missing client `grants`')
      }

      if (!_.includes(client.grants, 'authorization_code')) {
        throw new UnauthorizedClientError('Unauthorized client: `grant_type` is invalid')
      }

      if (!client.redirectUris || 0 === client.redirectUris.length) {
        throw new InvalidClientError('Invalid client: missing client `redirectUri`')
      }

      if (redirectUri && !_.includes(client.redirectUris, redirectUri)) {
        throw new InvalidClientError('Invalid client: `redirect_uri` does not match client value')
      }

      return client
    })
}

/**
 * Get scope from the request.
 */

AuthorizeHandler.prototype.getScope = function(request) {
  const scope = request.body.scope || request.query.scope

  if (!is.ngschar(scope)) {
    throw new InvalidScopeError('Invalid parameter: `scope`')
  }

  return scope
}

/**
 * Get state from the request.
 */

AuthorizeHandler.prototype.getState = function(request) {
  const state = request.body.state || request.query.state

  if (!this.allowEmptyState && !state) {
    throw new InvalidRequestError('Missing parameter: `state`')
  }

  if (!is.vschar(state)) {
    throw new InvalidRequestError('Invalid parameter: `state`')
  }

  return state
}

/**
 * Get user by calling the authenticate middleware.
 */

AuthorizeHandler.prototype.getUser = function(request, response) {
  if (this.authenticateHandler instanceof AuthenticateHandler) {
    return this.authenticateHandler.handle(request, response).get('user')
  }

  return promisify(this.authenticateHandler.handle, 2)(request, response).then(function(user) {
    if (!user) {
      throw new ServerError('Server error: `handle()` did not return a `user` object')
    }

    return user
  })
}

/**
 * Get redirect URI.
 */

AuthorizeHandler.prototype.getRedirectUri = function(request, client) {
  return request.body.redirect_uri || request.query.redirect_uri || client.redirectUris[0]
}

/**
 * Save authorization code.
 */

AuthorizeHandler.prototype.saveAuthorizationCode = function(authorizationCode, expiresAt, scope, client, redirectUri, user) {
  const code = {
    authorizationCode: authorizationCode,
    expiresAt: expiresAt,
    redirectUri: redirectUri,
    scope: scope,
  }

  return promisify(this.model.saveAuthorizationCode, 3).call(this.model, code, client, user)
}

/**
 * Get response type.
 */

AuthorizeHandler.prototype.getResponseType = function(request) {
  const responseType = request.body.response_type || request.query.response_type

  if (!responseType) {
    throw new InvalidRequestError('Missing parameter: `response_type`')
  }

  if (!_.has(responseTypes, responseType)) {
    throw new UnsupportedResponseTypeError('Unsupported response type: `response_type` is not supported')
  }

  return responseTypes[responseType]
}

/**
 * Build a successful response that redirects the user-agent to the client-provided url.
 */

AuthorizeHandler.prototype.buildSuccessRedirectUri = function(redirectUri, responseType) {
  return responseType.buildRedirectUri(redirectUri)
}

/**
 * Build an error response that redirects the user-agent to the client-provided url.
 */

AuthorizeHandler.prototype.buildErrorRedirectUri = function(redirectUri, error) {
  let uri = url.parse(redirectUri)

  uri.query = {
    error: error.name
  }

  if (error.message) {
    uri.query.error_description = error.message
  }

  return uri
}

/**
 * Update response with the redirect uri and the state parameter, if available.
 */

AuthorizeHandler.prototype.updateResponse = function(response, redirectUri, state) {
  redirectUri.query = redirectUri.query || {}

  if (state) {
    redirectUri.query.state = state
  }

  response.redirect(url.format(redirectUri))
}

/**
 *
 */

