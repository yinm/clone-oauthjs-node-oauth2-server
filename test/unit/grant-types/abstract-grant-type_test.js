'use strict'

const AbstractGrantType = require('../../../lib/grant-types/abstract-grant-type')
const sinon = require('sinon')
const should = require('should')

describe('AbstractGrantType', () => {
  describe('generateAccessToken()', () => {
    it('should call `model.generateAccessToken()', () => {
      const model = {
        generateAccessToken: sinon.stub().returns({ client: {}, expiresAt: new Date(), user: {} })
      }
      const handler = new AbstractGrantType({ accessTokenLifetime: 120, model: model })

      return handler.generateAccessToken()
        .then(() => {
          model.generateAccessToken.callCount.should.equal(1)
          model.generateAccessToken.firstCall.thisValue.should.equal(model)
        })
        .catch(should.fail)
    })
  })
})
