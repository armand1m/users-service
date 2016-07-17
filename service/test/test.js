const Events = require('../lib/events')
const Server = require("../lib/server")
const chai = require("chai")
const expect = chai.expect

const USERS_ROUTE = "/users"

const GET_HEALTH_REQUEST_OPTIONS = {
  method: "GET",
  url: "/health"
}

const GET_USERS_REQUEST_OPTIONS = {
  method: "GET",
  url: USERS_ROUTE
}

const POST_USERS_REQUEST_OPTIONS = {
  method: "POST",
  url: USERS_ROUTE,
  payload: {
    email: "test@gmail.com",
     password : "test123"
  }
}

const PUT_USERS_REQUEST_OPTIONS = id => {
  return {
    method: "PUT",
    url: USERS_ROUTE,
    payload: {
      id,
      email: "edited@email.com",
      active: false
    }
  }
}

const DELETE_USERS_REQUEST_OPTIONS = id => {
  return {
    method: "DELETE",
    url: USERS_ROUTE,
    payload: { id }
  }
}

describe("User service suite", () => {
  var instance = new Server().configure()
  var testUser = null
  
  it("should always start with testUser null.", () => {
    expect(testUser).to.be.null
  })

  describe("GET /health", () => {
    it("should return a status code 200 and service url and status in response payload.", done => {
      instance
      .server
      .inject(GET_HEALTH_REQUEST_OPTIONS)
      .then(response => {
        expect(response.statusCode).to.equal(200)
        return response.result
      })
      .then(body => {
        expect(body).to.have.property("status").to.equals("healthy")
        expect(body).to.have.property("url")

        done()
      })
      .catch(done)
    })
  })


  describe("POST /users", () => {
    it("should return a status code 201 and the created resource in response payload when sending valid payload.", done => {
      instance
      .server
      .inject(POST_USERS_REQUEST_OPTIONS)
      .then(response => {
        expect(response.statusCode).to.equal(201)
        return response.result
      })
      .then(body => {
        expect(body).to.be.an('object')
        expect(body.id).to.exist
        expect(body.email).to.equal(POST_USERS_REQUEST_OPTIONS.payload.email)
        expect(body.password).to.equal(POST_USERS_REQUEST_OPTIONS.payload.password)
        expect(body.active).to.be.true

        testUser = body
        
        done()
      })
      .catch(done)
    })

    it("should return a status code 400 when not sending a request payload.", (done) => {
      instance
      .server
      .inject(Object.assign({}, POST_USERS_REQUEST_OPTIONS, {
        payload: null
      }))
      .then(response => {
        expect(response.statusCode).to.equal(400)
        return response.result
      })
      .then(body => {
        done()
      })
      .catch(done)
    })

    it("should return a status code 400 when not sending email in request payload.", done => {
      var request = Object.assign({}, POST_USERS_REQUEST_OPTIONS, {
        payload: {}
      });

      instance
      .server
      .inject(request)
      .then(response => {
        expect(response.statusCode).to.equal(400)
        return response.result
      })
      .then(body => {
        expect("email").to.be.oneOf(body.validation.keys)
        done()
      })
      .catch(done)
    })
  
    it("should return a status code 400 when not sending password in request payload.", done => {
      instance
      .server
      .inject(Object.assign({}, POST_USERS_REQUEST_OPTIONS, {
        payload: {
          email: "test@gmail.com"
        }
      }))
      .then(response => {
        expect(response.statusCode).to.equal(400)
        return response.result
      })
      .then(body => {
        expect("password").to.be.oneOf(body.validation.keys)
        done()
      })
      .catch(done)
    })
  })


  describe("GET /users", () => {
    it("should return a status code 200 and all users as a json array in response payload.", done => {
      instance
      .server
      .inject(GET_USERS_REQUEST_OPTIONS)
      .then(response => {
        expect(response.statusCode).to.equal(200)
        return response.result
      })
      .then(body => {
        expect(body).to.be.an('array')

        done()
      })
      .catch(done)
    })

    it("should return a status code 200 and the user info when sending request with id as query string.", done => {
      instance
      .server
      .inject(Object.assign({}, GET_USERS_REQUEST_OPTIONS, {
        url: `${USERS_ROUTE}?id=${testUser.id}`
      }))
      .then(response => {
        expect(response.statusCode).to.equal(200)
        return response.result
      })
      .then(body => {
        expect(body).to.be.an('object')
        expect(body.id).to.be.equal(testUser.id)

        done()
      })
      .catch(done)
    })

    it("should return a status code 404 when sending request with an invalid id.", done => {
      instance
      .server
      .inject(Object.assign({}, GET_USERS_REQUEST_OPTIONS, {
        url: `${USERS_ROUTE}?id=xxxxx`
      }))
      .then(response => {
        expect(response.statusCode).to.equal(404)
        done();
      })
      .catch(done)
    })

    it("should return a status code 200 and an array of results when sending request querying by the 'active' parameter.", done => {
      instance
      .server
      .inject(Object.assign({}, GET_USERS_REQUEST_OPTIONS, {
        url: `${USERS_ROUTE}?active=true`
      }))
      .then(response => {
        expect(response.statusCode).to.equal(200)
        return response.result
      })
      .then(body => {
        expect(body).to.be.an('array')

        body.forEach(entry => expect(entry).to.have.property('active').to.be.true)
        
        done()
      })
      .catch(done)
    })

    it("should return a status code 200 and an empty array as payload when sending request querying by non existent data.", done => {
      instance
      .server
      .inject(Object.assign({}, GET_USERS_REQUEST_OPTIONS, {
        url: `${USERS_ROUTE}?active=false`
      }))
      .then(response => {
        expect(response.statusCode).to.equal(200)
        return response.result
      })
      .then(body => {
        expect(body).to.be.an('array')
        expect(body).to.be.empty
        done()
      })
      .catch(done)
    })

    it("should return a status code 400 when sending request with invalid parameters as query string.", done => {
      instance
      .server
      .inject(Object.assign({}, GET_USERS_REQUEST_OPTIONS, {
        url: `${USERS_ROUTE}?invalid=inv4l1dValu3`
      }))
      .then(response => {
        expect(response.statusCode).to.equal(400)
        return response.result
      })
      .then(body => {
        expect(body.validation.source).to.equal("query")
        expect('invalid').to.be.oneOf(body.validation.keys)

        done()
      })
      .catch(done)
    })
  })

  describe("PUT /users", () => {
    var request;

    it("should have a testUser.", done => {
      expect(testUser).to.be.an('object')
      expect(testUser).to.have.property("id")

      request = PUT_USERS_REQUEST_OPTIONS(testUser.id)

      done()
    })

    it("should return a status code 201 and the updates resource in response payload when sending valid payload.", done => {
      instance
      .server
      .inject(request)
      .then(response => {
        expect(response.statusCode).to.equal(201)
        return response.result
      })
      .then(body => {
        expect(body.id).to.be.equal(testUser.id);
        expect(body.email).to.be.not.equal(testUser.email);
        expect(body.email).to.be.equal(request.payload.email);

        testUser = body

        done()
      })
      .catch(done)
    })

    it("should return a status code 400 when not sending a request payload", done => {
      instance
      .server
      .inject(Object.assign({}, request, {
        payload: null
      }))
      .then(response => {
        expect(response.statusCode).to.equal(400)
        return response.result
      })
      .then(body => {
        done()
      })
      .catch(done)
    })

    it("should return a status code 400 when not sending resource id in request payload.", done => {
      instance
      .server
      .inject(Object.assign({}, request, {
        payload: {}
      }))
      .then(response => {
        expect(response.statusCode).to.equal(400)
        return response.result
      })
      .then(body => {
        expect("id").to.be.oneOf(body.validation.keys)
        done()
      })
      .catch(done)
    })
  })

  describe("DELETE /users", () => {
    var request

    it("should have a testUser.", done => {
      expect(testUser).to.be.an('object')
      expect(testUser).to.have.property("id")

      request = DELETE_USERS_REQUEST_OPTIONS(testUser.id)

      done()
    })

    it("should return a status code 200 and the deleted resource in response payload when sending valid payload.", done => {
      instance
      .server
      .inject(request)
      .then(response => {
        expect(response.statusCode).to.equal(200)
        return response.result
      })
      .then(body => {
        expect(JSON.stringify(body)).to.equal(JSON.stringify(testUser))
        done()
      })
      .catch(done)
    })

    it("should return a status code 400 when not sending a request payload", done => {
      instance
      .server
      .inject(Object.assign({}, request, {
        payload: null
      }))
      .then(response => {
        expect(response.statusCode).to.equal(400)
        return response.result
      })
      .then(body => {
        done()
      })
      .catch(done)
    })

    it("should return a status code 400 when not sending resource id in request payload.", done => {
      instance
      .server
      .inject(Object.assign({}, request, {
        payload: {}
      }))
      .then(response => {
        expect(response.statusCode).to.equal(400)
        return response.result
      })
      .then(body => {
        expect("id").to.be.oneOf(body.validation.keys)
        done()
      })
      .catch(done)
    })
  })
})