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

})
