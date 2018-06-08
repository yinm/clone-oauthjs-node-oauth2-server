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

/**
 *
 */

/**
 *
 */

/**
 *
 */
