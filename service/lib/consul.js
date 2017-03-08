const { consul } = require('./configuration')

module.exports = require('consul')(consul)
