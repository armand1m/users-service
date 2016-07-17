'use strict'

const Boom = require('boom')
const User = require('./model')

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
              id: User.types.id.optional(),
              email: User.types.email.optional(),
              active: User.types.active.optional()
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
              email: User.types.email.required(),
              password: User.types.password.required(),
              active: User.types.active.optional()
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
              id: User.types.id.required(),
              email: User.types.email.optional(),
              password: User.types.password.optional(),
              active: User.types.active.optional()
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
              id: User.types.id.required()
            }
          }
        }
      }
    ]
  }

  static health(request, reply) {
    reply({ url: request.server.info.url, status: 'healthy' })
  }

  static all(request, reply) {
    if (request.query.id)
      return User
      .get(request.query.id)
      .then(reply)
      .catch(err => {
        if (err.name == 'DocumentNotFoundError')
          return reply(Boom.notFound(`Resource with id ${request.query.id} could not be found.`))

        return reply(err)
      })

    if (request.query)
      return reply(User.filter(request.query).run())

    return reply(User.run())
  }

  static save(request, reply) {
    return reply(new User(request.payload).save()).code(201)
  }

  static update(request, reply) {
    return reply(User.get(request.payload.id).update(request.payload)).code(201)
  }

  static remove(request, reply) {
    return reply(User.get(request.payload.id).then(user => user.delete()))
  }
}

module.exports = Service
