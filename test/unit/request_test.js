'use strict'

const Request = require('../../lib/request')
const should = require('should')

function generateBaseRequest() {
  return {
    query: {
      foo: 'bar',
    },
    method: 'GET',
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
    const originalRequest = generateBaseRequest()

    const request = new Request(originalRequest)
    request.headers.should.eql(originalRequest.headers)
    request.method.should.eql(originalRequest.method)
    request.query.should.eql(originalRequest.query)
    request.body.should.eql(originalRequest.body)
  })

})
