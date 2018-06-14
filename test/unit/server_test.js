'use strict'

const AuthenticateHandler = require('../../lib/handlers/authenticate-handler')
const AuthorizeHandler = require('../../lib/handlers/authorize-handler')
const Promise = require('bluebird')
const Server = require('../../lib/server')
const TokenHandler = require('../../lib/handlers/token-handler')
const sinon = require('sinon')

describe('Server', () => {
  describe('authenticate()', () => {
    it('should call `handle`', () => {
      const model = {
        getAccessToken() {},
      }
      const server = new Server({ model: model })
      sinon.stub(AuthenticateHandler.prototype, 'handle').returns(Promise.resolve())
      server.authenticate('foo')

      AuthenticateHandler.prototype.handle.callCount.should.equal(1)
      AuthenticateHandler.prototype.handle.firstCall.args[0].should.equal('foo')
      AuthenticateHandler.prototype.handle.restore()
    })

    it('should map string passed as `options` to `options.scope`', () => {
      const model = {
        getAccessToken() {},
        verifyScope() {},
      }
      const server = new Server({ model: model })
      sinon.stub(AuthenticateHandler.prototype, 'handle').returns(Promise.resolve())
      server.authenticate('foo', 'bar', 'test')

      AuthenticateHandler.prototype.handle.callCount.should.equal(1)
      AuthenticateHandler.prototype.handle.firstCall.args[0].should.equal('foo')
      AuthenticateHandler.prototype.handle.firstCall.args[1].should.equal('bar')
      AuthenticateHandler.prototype.handle.firstCall.thisValue.should.have.property('scope', 'test')
      AuthenticateHandler.prototype.handle.restore()
    })

  })
})
