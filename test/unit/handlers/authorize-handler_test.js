'use strict'

const AuthorizeHandler = require('../../../lib/handlers/authorize-handler')
const Request = require('../../../lib/request')
const Response = require('../../../lib/response')
const Promise = require('bluebird')
const sinon = require('sinon')
const should = require('should')

describe('AuthorizeHandler', () => {
  describe('generateAuthorizationCode()', () => {
    it('should call `model.generateAuthorizationCode()`', () => {
      const model = {
        generateAuthorizationCode: sinon.stub().returns({}),
        getAccessToken() {},
        getClient() {},
        saveAuthorizationCode() {},
      }
      const handler = new AuthorizeHandler({ authorizationCodeLifetime: 120, model: model })

      return handler.generateAuthorizationCode()
        .then(() => {
          model.generateAuthorizationCode.callCount.should.equal(1)
          model.generateAuthorizationCode.firstCall.thisValue.should.equal(model)
        })
        .catch(should.fail)
    })
  })
})
