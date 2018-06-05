'use strict'

/**
 * Modules dependencies.
 */

const AbstractGrantType = require('./abstract-grant-type')
const InvalidArgumentError = require('../errors/invalid-argument-error')
const InvalidGrantError = require('../errors/invalid-grant-error')
const Promise = require('bluebird')
const promisify = require('promisify-any').use(Promise)
const util = require('util')

/**
 * Constructor.
 */

function ClientCredentialsGrantType(options) {
  options = options || {}

  if (!options.model) {
    throw new InvalidArgumentError('Missing parameter: `model`')
  }

  if (!options.model.getUserFromClient) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `getUserFromClient()`')
  }

  if (!options.model.saveToken) {
    throw new InvalidArgumentError('Invalid argument: model does not implement `saveToken()`')
  }

  AbstractGrantType.call(this, options)
}

/**
 * Inherit prototype.
 */

util.inherits(ClientCredentialsGrantType, AbstractGrantType)

/**
 * Handle client credentials grant.
 */

ClientCredentialsGrantType.prototype.handle = function(request, client) {
  if (!request) {
    throw new InvalidArgumentError('Missing parameter: `request`')
  }

  if (!client) {
    throw new InvalidArgumentError('Missing parameter: `client`')
  }

  const scope = this.getScope(request)

  return Promise.bind(this)
    .then(function() {
      return this.getUserFrom(client)
    })
    .then(function() {
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

/**
 *
 */
