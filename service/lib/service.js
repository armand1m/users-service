'use strict';

const Boom = require('boom');
const User = require('./model');
const Messages = require('./messages');

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
      return reply(Boom.preconditionRequired(Messages.PAYLOAD_IS_NEEDED));

    if (!request.payload.email)
      return reply(Boom.preconditionRequired(Messages.USER_EMAIL_IS_NEEDED));

    if (!request.payload.password)
      return reply(Boom.preconditionRequired(Messages.USER_PASSWORD_IS_NEEDED));

    return reply(new User(request.payload).save()); 
  }

  static update(request, reply) { 
    if (!request.payload)
      return reply(Boom.preconditionRequired(Messages.PAYLOAD_IS_NEEDED));

    if (!request.payload.id)
      return reply(Boom.preconditionRequired(Messages.USER_ID_IS_NEEDED));

    return reply(User.get(request.payload.id).update(request.payload)); 
  }

  static remove(request, reply) {
    if (!request.payload.id)
      return reply(Boom.preconditionRequired(Messages.USER_ID_IS_NEEDED));
    
    User
    .get(request.payload.id)
    .then(user => reply(user.delete()))
    .error(error => reply(error));
  }
}

module.exports = Service;
