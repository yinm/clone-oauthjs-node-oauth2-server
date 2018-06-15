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

  describe('getClient()', () => {
    it('should call `model.getClient()`', () => {
      const model = {
        getAccessToken() {},
        getClient: sinon.stub().returns({ grants: ['authorization_code'], redirectUris: ['http://example.com/cb'] }),
        saveAuthorizationCode() {},
      }
      const handler = new AuthorizeHandler({ authorizationCodeLifetime: 120, model: model })
      const request = new Request({ body: { client_id: 12345, client_secret: 'secret' }, headers: {}, method: {}, query: {} })

      return handler.getClient(request)
        .then(() => {
          model.getClient.callCount.should.equal(1)
          model.getClient.firstCall.args.should.have.length(2)
          model.getClient.firstCall.args[0].should.equal(12345)
          model.getClient.firstCall.thisValue.should.equal(model)
        })
    })
  })

})
