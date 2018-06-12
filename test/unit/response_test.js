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

  it('should allow a response to be passed without a body', () => {
    const originalResponse = generateBaseResponse()
    delete originalResponse.body

    const response = new Response(originalResponse)
    response.headers.should.eql(originalResponse.headers)
    response.body.should.eql({})
    response.status.should.eql(200)
  })

  it('should allow a response to be passed without a headers', () => {
    const originalResponse = generateBaseResponse()
    delete originalResponse.headers

    const response = new Response(originalResponse)
    response.headers.should.eql({})
    response.body.should.eql(originalResponse.body)
    response.status.should.eql(200)
  })

  it('should convert all header keys to lowercase', () => {
    const originalResponse = generateBaseResponse()
    originalResponse.headers = {
      Foo: 'bar',
      BAR: 'foo',
    }

    const response = new Response(originalResponse)
    response.headers.foo.should.eql('bar')
    response.headers.bar.should.eql('foo')
    should.not.exist(response.headers.Foo)
    should.not.exist(response.headers.BAR)
  })

  it('should include additional properties passed in the response', () => {
    const originalResponse = generateBaseResponse()
    originalResponse.custom = {
      newFoo: 'newBar',
    }
    originalResponse.custom2 = {
      newBar: 'newFoo',
    }

    const response = new Response(originalResponse)
    response.headers.should.eql(originalResponse.headers)
    response.body.should.eql(originalResponse.body)
    response.custom.should.eql(originalResponse.custom)
    response.custom2.should.eql(originalResponse.custom2)
  })

  it('should allow getting of headers using `response.get`', () => {
    const originalResponse = generateBaseResponse()

    const response = new Response(originalResponse)
    response.get('bar').should.eql(originalResponse.headers.bar)
  })

  it('should allow setting of headers using `response.set`', () => {
    const originalResponse = generateBaseResponse()

    let response = new Response(originalResponse)
    response.headers.should.eql(originalResponse.headers)
    response.set('newheader', 'newvalue')
    response.headers.bar.should.eql('foo')
    response.headers.newheader.should.eql('newvalue')
  })

})
