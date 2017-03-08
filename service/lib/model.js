'use strict'

const Joi = require('joi')
const Database = require('./database')
const type = require('thinky').type

const DATABASE_SCHEMA = {
  id: type.string(),
  email: type.string().email().required(),
  password: type.string().required(),
  active: type.boolean().default(true)
}

const JOI_SCHEMA = {
  id: Joi.string().description("User Id"),
  email: Joi.string().email().description("User Email"),
  password: Joi.string().description("User Password"),
  active: Joi.boolean().description("User Active Flag")
}

const Model = Database.createModel("User", DATABASE_SCHEMA)

Model.types = JOI_SCHEMA

module.exports = Model
