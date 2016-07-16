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
    "email": "test@gmail.com",
    "password": "test123"
  }
}

const PUT_USERS_REQUEST_OPTIONS = id => {
  return {
    method: "PUT",
    url: USERS_ROUTE,
    payload: {
      id,
      "email": "edited@email.com"
    }
  }
}

describe("User service", () => {
  var instance = new Server().configure()
  
  describe("GET /health", () => {
    it("should return a status code 200 and service status in response payload.", done => {
      instance
      .server
      .inject(GET_HEALTH_REQUEST_OPTIONS)
      .then(response => {
        expect(response.statusCode).to.equal(200)
        return response.result;
      })
      .then(body => {
        expect(body).to.deep.equal({ status: "healthy" })
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
        return response.result;
      })
      .then(body => {
        expect(body).to.be.an.array
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
        expect(response.result).to.be.an.object
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

  describe("PUT /users", () => {
    it("should return a status code 201 and the updates resource in response payload when sending valid payload.", done => {
      instance
      .server
      .inject(PUT_USERS_REQUEST_OPTIONS(null))
      .then(response => {
        expect(response.statusCode).to.equal(201)
        return response.result
      })
      .then(body => {
        done()
      })
      .catch(done)
    })

    it("should return a status code 400 when not sending a request payload")
    it("should return a status code 400 when not sending email in request payload.")
    it("should return a status code 400 when not sending password in request payload.")
  })

  describe("DELETE /users", () => {
    it("should return a status code 204 and the deleted resource in response payload when sending valid payload.")
    it("should return a status code 400 when not sending a request payload")
    it("should return a status code 400 when not sending resource id in a request payload")
  })
})

// instance
// .server
// .inject()
// .then(response => {
//   return response.result;
// })
// .then(body => {
//   done()
// })
// .catch(done)