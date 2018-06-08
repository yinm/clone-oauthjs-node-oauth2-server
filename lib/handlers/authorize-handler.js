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
