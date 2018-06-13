'use strict'

const RefreshTokenGrantType = require('../../../lib/grant-types/refresh-token-grant-type')
const Request = require('../../../lib/request')
const sinon = require('sinon')
const should = require('should')

describe('RefreshTokenGrantType', () => {
  describe('handle()', () => {
    it('should revoke the previous token', () => {
      const token = { accessToken: 'foo', client: {}, user: {} }
      const model = {
        getRefreshToken() { return token },
        saveToken() { return { accessToken: 'bar', client: {}, user: {} } },
        revokeToken: sinon.stub().returns({ accessToken: 'foo', client: {}, refreshTokenExpiresAt: new Date(new Date() / 2), user: {} })
      }
      const handler = new RefreshTokenGrantType({ accessTokenLifetime: 120, model: model })
      const request = new Request({ body: { refresh_token: 'bar' }, headers: {}, method: {}, query: {} })
      const client = {}

      return handler.handle(request, client)
        .then(() => {
          model.revokeToken.callCount.should.equal(1)
          model.revokeToken.firstCall.args.should.have.length(1)
          model.revokeToken.firstCall.args[0].should.equal(token)
          model.revokeToken.firstCall.thisValue.should.equal(model)
        })
        .catch(should.fail)
    })
  })

  describe('getRefreshToken()', () => {
    it('should call `model.getRefreshToken()`', () => {
      const model = {
        getRefreshToken: sinon.stub().returns({ accessToken: 'foo', client: {}, user: {} }),
        saveToken: () => {},
        revokeToken: () => {}
      }
      const handler = new RefreshTokenGrantType({ accessTokenLifetime: 120, model: model })
      const request = new Request({ body: { refresh_token: 'bar' }, headers: {}, method: {}, query: {} })
      const client = {}

      return handler.getRefreshToken(request, client)
        .then(() => {
          model.getRefreshToken.callCount.should.equal(1)
          model.getRefreshToken.firstCall.args.should.have.length(1)
          model.getRefreshToken.firstCall.args[0].should.equal('bar')
          model.getRefreshToken.firstCall.thisValue.should.equal(model)
        })
        .catch(should.fail)
    })
  })

})