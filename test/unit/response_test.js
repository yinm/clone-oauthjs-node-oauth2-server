'use strict'

const Response = require('../../lib/response')
const should = require('should')

function generateBaseResponse() {
  return {
    headers: {
      bar: 'foo',
    },
    body: {
      foobar: 'barfoo',
    },
  }
}

describe('Request', () => {
  it('should instantiate with a basic request', () => {
    const originalResponse = generateBaseResponse()

    const response = new Response(originalResponse)
    response.headers.should.eql(originalResponse.headers)
    response.body.should.eql(originalResponse.body)
    response.status.should.eql(200)
  })

})
