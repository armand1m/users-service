'use strict';

const Joi = require('joi');
const Boom = require('boom');
const User = require('./model');
const Messages = require('./messages');

class Service {
  static getRoutes(path) {
    return [
      { 
        path: '/health', 
        method: 'GET', 
        handler: Service.health
      },
      { 
        path, 
        method: 'GET', 
        handler: Service.all,
        config: {
          validate: {
            query: {
              id: Joi.string().optional()
            }
          }
        }
      },
      { 
        path, 
        method: 'POST', 
        handler: Service.save,
        config: {
          validate: {
            payload: {
              email: Joi.string().email().required(),
              password: Joi.string().required(),
              active: Joi.boolean().optional()
            }
          },
        } 
      },
      { 
        path, 
        method: 'PUT', 
        handler: Service.update,
        config: {
          validate: {
            payload: {
              id: Joi.string().required(),
              email: Joi.string().email(),
              password: Joi.string().optional(),
              active: Joi.boolean().optional()
            }
          } 
        } 
      },
      { 
        path, 
        method: 'DELETE', 
        handler: Service.remove,
        config: {
          validate: {
            payload: {
              id: Joi.string().required()
            }
          }
        } 
      }
    ];
  }

  static health(request, reply) { 
    reply({ status: 'healthy' }); 
  }

  static all(request, reply) { 
    if (request.query.id)
      return reply(User.get(request.query.id));

    return reply(User.run()); 
  }

  static save(request, reply) { 
    return reply(new User(request.payload).save()).code(201); 
  }

  static update(request, reply) { 
    return reply(User.get(request.payload.id).update(request.payload)).code(201); 
  }

  static remove(request, reply) {
    return reply(User.get(request.payload.id).then(user => user.delete()));
  }
}

module.exports = Service;
