'use strict'

/**
 * Module dependencies.
 */

const InvalidArgumentError = require('./errors/invalid-argument-error')
const typeis = require('type-is')


/**
 * Constructor.
 */

function Request(options) {
  options = options || {}

  if (!options.header) {
    throw new InvalidArgumentError('Missing parameter: `headers`')
  }

  if (!options.method) {
    throw new InvalidArgumentError('Missing parameter: `method`')
  }

  if (!options.query) {
    throw new InvalidArgumentError('Missing parameter: `query`')
  }

  this.body = options.body || {}
  this.headers = {}
  this.method = options.method
  this.query = options.query

  // Store the headers in lower case.
  for (let field in options.header) {
    if (options.headers.hasOwnProperty(field)) {
      this.headers[field.toLowerCase()] = options.header[field]
    }
  }

  // Store additional properties of the request object passed in
  for (let property in options) {
    if (options.hasOwnProperty(property) && !this[property]) {
      this[property] = options[property]
    }
  }
}
