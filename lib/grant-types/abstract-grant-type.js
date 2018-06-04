'use strict'

/**
 * Module dependencies.
 */

const InvalidArgumentError = require('../errors/invalid-argument-error')
const InvalidScopeError = require('../errors/invalid-scope-error')
const Promise = require('bluebird')
const promisify = require('promisify-any').use(Promise)
const is = require('../validator/is')
const tokenUtil = require('../utils/token-util')

/**
 * Constructor.
 */

function AbstractGrantType(options) {
  options = options || {}

  if (!options.accessTokenLifetime) {
    throw new InvalidArgumentError('Missing parameter: `accessTokenLifetime`')
  }

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  this.accessTokenLifetime = options.accessTokenLifetime
  this.model = options.model
  this.refreshTokenLifetime = options.refreshTokenLifetime
  this.alwaysIssueNewRefreshToken = options.alwaysIssueNewRefreshToken
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
