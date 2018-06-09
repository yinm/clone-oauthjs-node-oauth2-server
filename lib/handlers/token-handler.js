'use strict'

/**
 * Module dependencies.
 */

const _ = require('loash')
const BearerTokenType = require('../token-types/bearer-token-type')
const InvalidArgumentError = require('../errors/invalid-argument-error');
const InvalidClientError = require('../errors/invalid-client-error');
const InvalidRequestError = require('../errors/invalid-request-error');
const OAuthError = require('../errors/oauth-error');
const Promise = require('bluebird');
const promisify = require('promisify-any').use(Promise);
const Request = require('../request');
const Response = require('../response');
const ServerError = require('../errors/server-error');
const TokenModel = require('../models/token-model');
const UnauthorizedClientError = require('../errors/unauthorized-client-error');
const UnsupportedGrantTypeError = require('../errors/unsupported-grant-type-error');
const auth = require('basic-auth');
const is = require('../validator/is');

/**
 * Grant types.
 */

const grantTypes = {
  authorization_code: require('../grant-types/authorization-code-grant-type'),
  client_credentials: require('../grant-types/client-credentials-grant-type'),
  password: require('../grant-types/password-grant-type'),
  refresh_token: require('../grant-types/refresh-token-grant-type'),
}

/**
 * Constructor.
 */

function TokenHandler(options) {
  options = options || {}

  if (!options.accessTokenLifetime) {
    throw new InvalidArgumentError('Missing parameter: `accessTokenLifetime`')
  }

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  if (!options.refreshTokenLifetime) {
    throw new InvalidArgumentError('Missing parameter: `refreshTokenLifetime`')
  }

  if (!options.model.getClient) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getClient()`')
  }

  this.accessTokenLifetime = options.accessTokenLifetime
  this.grantTypes = _.assign({}, grantTypes, options.extendedGrantTypes)
  this.model = options.model
  this.refreshTokenLifetime = options.refreshTokenLifetime
  this.allowExtendedTokenAttributes = options.allowExtendedTokenAttributes
  this.requireClientAuthentication = options.requireClientAuthentication || {}
  this.alwaysIssueNewRefreshToken = options.alwaysIssueNewRefreshToken !== false
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

/**
 *
 */

/**
 *
 */
