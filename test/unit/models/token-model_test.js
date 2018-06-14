'use strict'

const TokenModel = require('../../../lib/models/token-model')

describe('Model', () => {
  describe('constructor()', () => {
    it('should calculate `accessTokenLifetime` if `accessTokenExpiresAt` is set', () => {
      let atExpiresAt = new Date()
      atExpiresAt.setHours(new Date().getHours() + 1)

      const data = {
        accessToken: 'foo',
        client: 'bar',
        user: 'tar',
        accessTokenExpiresAt: atExpiresAt,
      }

      const model = new TokenModel(data)
      model.accessTokenLifetime.should.be.Number
      model.accessTokenLifetime.should.be.approximately(3600, 2)
    })
  })
})
