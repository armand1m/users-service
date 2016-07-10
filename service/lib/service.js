'use strict';

const Boom = require('boom');
const User = require('./model');

class Service {
  static getRoutes(path) {
    return [
      { method: 'GET', path, handler: Service.all },
      { method: 'POST', path, handler: Service.save },
      { method: 'PUT', path, handler: Service.update },
      { method: 'DELETE', path, handler: Service.remove },
      { method: 'GET', path: '/health', handler: Service.health }
    ];
  }

  static health(request, reply) { 
    reply({ status: 'healthy' }); 
  }

  static all(request, reply) { 
    reply(User.run()); 
  }

  static save(request, reply) { 
    if (!request.payload)
      return reply(Boom.preconditionRequired('Payload is needed'));

    if (!request.payload.email)
      return reply(Boom.preconditionRequired("User email is needed."));

    if (!request.payload.password)
      return reply(Boom.preconditionRequired("User password is needed."));

    return reply(new User(request.payload).save()); 
  }

  static update(request, reply) { 
    if (!request.payload)
      return reply(Boom.preconditionRequired('Payload is needed'));

    if (!request.payload.id)
      return reply(Boom.preconditionRequired('User id is needed'));

    return reply(User.get(request.payload.id).update(request.payload)); 
  }

  static remove(request, reply) {
    if (!request.payload.id)
      return reply(new Error("User id is needed."));
    
    User
    .get(request.payload.id)
    .then(user => reply(user.delete()))
    .error(error => reply(error));
  }
}

module.exports = Service;
