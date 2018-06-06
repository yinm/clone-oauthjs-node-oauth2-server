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
const is = require('../validator')
const util = require('util')

/**
 * Constructor.
 */

function PasswordGrantType(options) {
  options = options || {}

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  if (!options.model.getUser) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getUser()`')
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`')
  }

  AbstractGrantType.call(this, options)
}

/**
 * Inherit prototype.
 */

util.inherits(PasswordGrantType, AbstractGrantType)

/**
 * Retrieve the user from the model using a username/password combination.
 *
 * @see https://tools.ietf.org/html/rfc6749#section-4.3.2
 */

PasswordGrantType.prototype.handle = function(request, client) {
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`')
  }

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`')
  }

  const scope = this.getScope(request)

  return Promise.bind(this)
    .then(function() {
      return this.getUser(request)
    })
    .then(function(user) {
      return this.saveToken(user, client, scope)
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
