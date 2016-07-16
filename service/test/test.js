const Server = require("../lib/server")
const chai = require("chai")
const expect = chai.expect;

var instance = new Server().configure();

describe("User service", () => {
  describe("GET /health", () => {
    it("should return service healthy when requested.", done => {
      var options = {
        method: "GET",
        url: "/health"
      }

      instance
      .server
      .inject(options)
      .then(response => {
        var result = response.result

        expect(response.statusCode).to.equal(200)
        expect(result).to.deep.equal({ status: 'healthy' })

        done()
      })
      .catch(done)
    })
  })

  describe("GET /users", () => {
    it("should return all users as json.", done => {
      var options = {
        method: "GET",
        url: "/users"
      }

      instance
      .server
      .inject(options)
      .then(response => {
        var result = response.result

        expect(response.statusCode).to.equal(200)

        done()
      })
      .catch(done)
    })
  })

  describe("POST /users", () => {
    it("should include a user and return code 201.", done => {
      var options = {
        method: "POST",
        url: "/users",201
        payload: {
          "email": "test@test.com",
          "password": "321"
        }
      }

      instance
      .server
      .inject(options)
      .then(response => {
        var result = response.result

        expect(response.statusCode).to.equal(201)
        expect(result).to.be.an.object

        done();
      })
      .catch(done)
    })
  })

  describe("PUT /users", () => {
    it("should update existing user and return ")
  })
})
