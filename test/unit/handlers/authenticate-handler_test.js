'use strict'

const AuthenticateHandler = require('../../../lib/handlers/authenticate-handler')
const Request = require('../../../lib/request')
const sinon = require('sinon')
const should = require('should')
const ServerError = require('../../../lib/errors/server-error')

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
})
