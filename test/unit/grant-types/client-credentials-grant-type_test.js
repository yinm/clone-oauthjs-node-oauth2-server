'use strict'

const ClientCredentialsGrantType = require('../../../lib/grant-types/client-credentials-grant-type')
const sinon = require('sinon')
const should = require('should')

describe('ClientCredentialsGrantType', () => {
  describe('getUserFromClient()', () => {
    it('should call `model.getUserFromClient()`', () => {
      const model = {
        getUserFromClient: sinon.stub().returns(true),
        saveToken: () => {},
      }
      const handler = new ClientCredentialsGrantType({ accessTokenLifetime: 120, model: model })
      const client = {}

      return handler.getUserFromClient(client)
        .then(() => {
          model.getUserFromClient.callCount.should.equal(1)
          model.getUserFromClient.firstCall.args.should.have.length(1)
          model.getUserFromClient.firstCall.args[0].should.equal(client)
          model.getUserFromClient.firstCall.thisValue.should.equal(model)
        })
        .catch(should.fail)
    })
  })
})
