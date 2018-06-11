'use strict'

const PasswordGrantType = require('../../../lib/grant-types/password-grant-type')
const Request = require('../../../lib/request')
const sinon = require('sinon')
const should = require('should')

describe('PasswordGrantType', () => {
  describe('getUser()', () => {
    it('should call `model.getUser()`', () => {
      const model = {
        getUser: sinon.stub().returns(true),
        saveToken: () => {}
      }
      const handler = new PasswordGrantType({ accessTokenLifetime: 120, model: model })
      const request = new Request({ body: { username: 'foo', password: 'bar' }, headers: {}, method: {}, query: {} })

      return handler.getUser(request)
        .then(() => {
          model.getUser.callCount.should.equal(1)
          model.getUser.firstCall.args.should.have.length(2)
          model.getUser.firstCall.args[0].should.equal('foo')
          model.getUser.firstCall.args[1].should.equal('bar')
          model.getUser.firstCall.thisValue.should.equal(model)
        })
    })
  })

  describe('saveToken()', () => {
    it('should call `model.saveToken()`', () => {
      const client = {}
      const user = {}
      const model = {
        getUser: () => {},
        saveToken: sinon.stub().returns(true)
      }
      const handler = new PasswordGrantType({ accessTokenLifetime: 120, model: model })

      sinon.stub(handler, 'validateScope').returns('foobar')
      sinon.stub(handler, 'generateAccessToken').returns('foo')
      sinon.stub(handler, 'generateRefreshToken').returns('bar')
      sinon.stub(handler, 'getAccessTokenExpiresAt').returns('biz')
      sinon.stub(handler, 'getRefreshTokenExpiresAt').returns('baz')

      return handler.saveToken(user, client, 'foobar')
        .then(() => {
          model.saveToken.callCount.should.equal(1)
          model.saveToken.firstCall.args.should.have.length(3)
          model.saveToken.firstCall.args[0].should.eql({ accessToken: 'foo', accessTokenExpiresAt: 'biz', refreshToken: 'bar', refreshTokenExpiresAt: 'baz', scope: 'foobar' })
          model.saveToken.firstCall.args[1].should.equal(client)
          model.saveToken.firstCall.args[2].should.equal(user)
          model.saveToken.firstCall.thisValue.should.equal(model)
        })
        .catch(should.fail)
    })
  })
})
