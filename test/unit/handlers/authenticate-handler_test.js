'use strict'

const AuthenticateHandler = require('../../../lib/handlers/authenticate-handler')
const Request = require('../../../lib/request')
const sinon = require('sinon')
const should = require('should')
const ServerError = require('../../../lib/errors/server-error')
const InvalidTokenError = require('../../../lib/errors/invalid-token-error')

describe('AuthenticateHandler', () => {
  describe('getTokenFromRequest()', () => {
    describe('with bearer token in the request authorization header', () => {
      it('should call `getTokenFromRequestHeader()`', () => {
        const handler = new AuthenticateHandler({ model: { getAccessToken() {} } })
        const request = new Request({
          body: {},
          headers: { 'Authorization': 'Bearer foo' },
          method: {},
          query: {}
        })

        sinon.spy(handler, 'getTokenFromRequestHeader')
        handler.getTokenFromRequest(request)

        handler.getTokenFromRequestHeader.callCount.should.equal(1)
        handler.getTokenFromRequestHeader.firstCall.args[0].should.equal(request)
      })
    })

    describe('with bearer token in the request query', () => {
      it('should call `getTokenFromRequestQuery()`', () => {
        const handler = new AuthenticateHandler({ model: { getAccessToken() {} } })
        const request = new Request({
          body: {},
          headers: {},
          method: {},
          query: { access_token: 'foo' }
        })

        sinon.stub(handler, 'getTokenFromRequestQuery')
        handler.getTokenFromRequest(request)

        handler.getTokenFromRequestQuery.callCount.should.equal(1)
        handler.getTokenFromRequestQuery.firstCall.args[0].should.equal(request)
        handler.getTokenFromRequestQuery.restore()
      })
    })

    describe('with bearer token in the request body', () => {
      it('should call `getTokenFromRequestBody()`', () => {
        const handler = new AuthenticateHandler({ model: { getAccessToken() {} } })
        const request = new Request({
          body: { access_token: 'foo' },
          headers: {},
          method: {},
          query: {}
        })

        sinon.stub(handler, 'getTokenFromRequestBody')
        handler.getTokenFromRequest(request)

        handler.getTokenFromRequestBody.callCount.should.equal(1)
        handler.getTokenFromRequestBody.firstCall.args[0].should.equal(request)
        handler.getTokenFromRequestBody.restore()
      })
    })
  })

  describe('getAccessToken()', () => {
    it('should call `model.getAccessToken()`', () => {
      const model = {
        getAccessToken: sinon.stub().returns({ user: {} })
      }
      const handler = new AuthenticateHandler({ model: model })

      return handler.getAccessToken('foo')
        .then(() => {
          model.getAccessToken.callCount.should.equal(1)
          model.getAccessToken.firstCall.args.should.have.length(1)
          model.getAccessToken.firstCall.args[0].should.equal('foo')
          model.getAccessToken.firstCall.thisValue.should.equal(model)
        })
        .catch(should.fail)
    })
  })

  describe('validateAccessToken()', () => {
    it('should fail if token has no valid `accessTokenExpiresAt` date', () => {
      const model = {
        getAccessToken() {},
      }
      const handler = new AuthenticateHandler({ model: model })

      let failed = false
      try {
        handler.validateAccessToken({
          user: {}
        })
      }
      catch(err) {
        err.should.be.an.instanceOf(ServerError)
        failed = true
      }
      failed.should.equal(true)
    })

    it('should fail if token has expired `accessTokenExpiresAt` date', () => {
      const model = {
        getAccessToken() {},
      }
      const handler = new AuthenticateHandler({ model: model })

      let failed = false
      try {
        handler.validateAccessToken({
          user: {},
          accessTokenExpiresAt: new Date(new Date().getTime() - 100000)
        })
      }
      catch(err) {
        err.should.be.an.instanceOf(InvalidTokenError)
        failed = true
      }
      failed.should.equal(true)
    })

    it('should succeed if token has valid `accessTokenExpiresAt` date', () => {
      const model = {
        getAccessToken() {},
      }
      const handler = new AuthenticateHandler({ model: model })

      try {
        handler.validateAccessToken({
          user: {},
          accessTokenExpiresAt: new Date(new Date().getTime() + 10000)
        })
      }
      catch(err) {
        should.fail()
      }
    })
  })

})
