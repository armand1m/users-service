const os = require('os')

process.env.SERVICE_HOST = os.hostname()

const PREFIXES = process.env.PREFIXES.split(",")
const toTags = prefix => `urlprefix-${prefix}`

const Configuration = {
  thinky: {
    db: process.env.SERVICE_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    silent: true
  },
  consul: {
    host: process.env.CONSUL_HOST,
    port: process.env.CONSUL_PORT,
    promisify: true
  },
  server: {
    connection: {
      port: +process.env.SERVICE_PORT,
      routes: { 
        cors: true 
      }
    },
    onAddRoute: route => console.log(`+ ${route.method} ${route.path}`)
  },
  swagger: {
    jsonPath: `${PREFIXES[0]}/swagger.json`,
    documentationPath: `${PREFIXES[0]}/documentation`,
    swaggerUIPath: `${PREFIXES[0]}/swaggerui/`,
    info: {
      title: process.env.SERVICE_TITLE ,
      description: `${process.env.SERVICE_DESCRIPTION}\n Running Host: ${process.env.SERVICE_HOST}`,
      version: process.env.SERVICE_VERSION,
      contact: {
        name: 'Armando Magalhães',
        email: 'armando.mag95@gmail.com'
      },
    }
  },
  service: {
    name: process.env.SERVICE_NAME,
    host: process.env.SERVICE_HOST,
    port: +process.env.SERVICE_PORT,
    prefixes: PREFIXES,
    tags: PREFIXES.map(toTags),
    route: PREFIXES[0]
  }
}

Configuration.service.uri = `http://${Configuration.service.host}:${Configuration.service.port}`
Configuration.service.description = {
  name: `${Configuration.service.name}:${Configuration.service.host}`,
  address: Configuration.service.host,
  port: Configuration.service.port,
  tags: Configuration.service.tags,
  check: {
    http: `${Configuration.service.uri}${Configuration.service.route}/health`,
    interval: '10s'
  }
}

module.exports = Configuration