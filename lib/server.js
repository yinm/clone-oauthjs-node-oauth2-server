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

