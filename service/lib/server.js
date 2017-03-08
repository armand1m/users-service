'use strict'

const Hapi = require('hapi')
const ConsulAgentService = require('./consul').agent.service
const Configuration = require('./configuration')
const Service = require('./service')
const HapiSwagger = require('hapi-swagger')

module.exports = class Server {
  constructor() {
    this.server = new Hapi.Server()
  }

  configure() {
    let server = this.server

    server.connection(Configuration.server.connection)

    server.on('route', Configuration.server.onAddRoute)

    server.register([
      require('inert'),
      require('vision'),
      {
        register: HapiSwagger,
        options: Configuration.swagger
      }
    ], err => {
      if (err) {
        throw err
      }
    })

    Service
    .getRoutes(Configuration.service.route)
    .forEach(route => server.route(route))

    return this
  }

  start() {
    return new Promise((resolve, reject) => this.server.start(err => err ? reject(err) : resolve(this)))
  }

  register() {
    return ConsulAgentService.register(Configuration.service.description)
  }

  unregister() {
    return ConsulAgentService.deregister(Configuration.service.description.name)
  }
}
