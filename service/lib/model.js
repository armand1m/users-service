'use strict';

const Joi = require('joi');
const Database = require('./database');
const type = require('thinky').type;

const schema = (builder, enforced) => {
  var cleanSchema = {
    id: builder.string(),
    email: builder.string().email(),
    password: builder.string(),
    active: builder.boolean()
  }

  if (!enforced) 
    return cleanSchema;

  var enforcedSchema = {
    id: cleanSchema.id,
    email: cleanSchema.email.required(),  
    password: cleanSchema.password.required(),  
    active: cleanSchema.active.default(true)  
  }

  return enforcedSchema;
}

const Model = Database.createModel("User", schema(type, true));

Model.types = schema(Joi);

module.exports = Model;
