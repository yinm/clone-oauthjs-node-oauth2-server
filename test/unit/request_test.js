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

  it('should allow a request to be passed without a body', () => {
    const originalRequest = generateBaseRequest()
    delete originalRequest.body

    const request = new Request(originalRequest)
    request.headers.should.eql(originalRequest.headers)
    request.query.should.eql(originalRequest.query)
    request.body.should.eql({})
  })

  it('should throw if headers are not passed to the constructor', () => {
    const originalRequest = generateBaseRequest()
    delete originalRequest.headers;

    (() => {
      new Request(originalRequest)
    }).should.throw('Missing parameter: `headers`')
  })

  it('should throw if query string is not passed to the constructor', () => {
    const originalRequest = generateBaseRequest()
    delete originalRequest.query;

    (() => {
      new Request(originalRequest)
    }).should.throw('Missing parameter: `query`')
  })

  it('should throw if method is not passed to the constructor', () => {
    const originalRequest = generateBaseRequest()
    delete originalRequest.method;

    (() => {
      new Request(originalRequest)
    }).should.throw('Missing parameter: `method`')
  })

  it('should convert all header keys to lowercase', () => {
    const originalRequest = generateBaseRequest()
    originalRequest.headers = {
      Foo: 'bar',
      BAR: 'foo',
    }

    const request = new Request(originalRequest)
    request.headers.foo.should.eql('bar')
    request.headers.bar.should.eql('foo')
    should.not.exist(request.headers.Foo)
    should.not.exist(request.headers.BAR)
  })

})
