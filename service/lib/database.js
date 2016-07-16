const thinky = require('thinky')


let database = thinky({
  db: process.env.SERVICE_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
})

module.exports = database
