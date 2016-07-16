'use strict';

const Joi = require('joi');
const Boom = require('boom');
const User = require('./model');
const Messages = require('./messages');

class Service {
  static getRoutes(path) {
    return [
      { 
        path, 
        method: 'GET', 
        handler: Service.all
      },
      { 
        path, 
        method: 'POST', 
        handler: Service.save,
        config: {
          validate: {
            payload: {
              email: Joi.string().email().required(),
              password: Joi.string().required()
            }
          },
        } 
      },
      { 
        path, 
        method: 'PUT', 
        config: {
          validate: {
            params: {}
          },
          handler: Service.update
        } 
      },
      { 
        path, 
        method: 'DELETE', 
        config: {
          validate: {
            params: {}
          },
          handler: Service.remove
        } 
      },
      { 
        path: '/health', 
        method: 'GET', 
        config: {
          validate: {
            params: {}
          },
          handler: Service.health
        } 
      }
    ];
  }

  static health(request, reply) { 
    reply({ status: 'healthy' }); 
  }

  static all(request, reply) { 
    reply(User.run()); 
  }

  static save(request, reply) { 
    return reply(new User(request.payload).save()).code(201); 
  }

  static update(request, reply) { 
    return reply(User.get(request.payload.id).update(request.payload)).code(201); 
  }

  static remove(request, reply) {
    User
    .get(request.payload.id)
    .then(user => reply(user.delete()))
    .error(error => reply(error));
  }
}

module.exports = Service;
