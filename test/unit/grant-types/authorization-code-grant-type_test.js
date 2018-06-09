'use strict'

const AuthorizationCodeGrantType = require('../../../lib/grant-types/authorization-code-grant-type')
const Promise = require('bluebird')
const Request = require('../../../lib/response')
const sinon = require('sinon')
const should = require('should')

describe('AuthorizationCodeGrantType', () => {
  describe('getAuthorizationCode()', () => {
    it('should call `model.getAuthorizationCode()`', () => {
      const model = {
        getAuthorizationCode: sinon.stub().returns({ authorizationCode: 12345, client: {}, expiresAt: new Date(new Date() * 2), user: {} }),
        revokeAuthorizationCode: () => {},
        saveToken: () => {},
      }
      const handler = new AuthorizationCodeGrantType({ accessTokenLifetime: 120, model: model })
      const request = new Request({ body: { code: 12345 }, headers: {}, method: {}, query: {} })
      const client = {}

      return handler.getAuthorizationCode(request, client)
        .then(() => {
          model.getAuthorizationCode.callCount.should.equal(1)
          model.getAuthorizationCode.firstCall.args.should.have.length(1)
          model.getAuthorizationCode.firstCall.args[0].should.equal(12345)
          model.getAuthorizationCode.firstCall.thisValue.should.equal(model)
        })
        .catch(should.fail)
    })
  })
})
