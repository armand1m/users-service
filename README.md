# Users Service

This is a microservice built in Node.js using Hapi and RethinkDB with the purpose of handling users.

# Development Environment

The development environment is defined in the default `docker-compose.yml` file.

It uses volumes and `nodemon` so you don't need to rebuild the image and run the container everytime you do code changes.

## Running development environment
    ```bash
    $ sudo docker-compose up -d
    ```

# Test Environment

The test environment is defined in the `docker-compose.test.yml` file.

It uses volumes and `mocha --recursive --watch`, so you have live reloading of your code changes like in the development environment without needing to rebuild the image.

## Running test development environment
    ```bash
    $ sudo docker-compose -f docker-compose.test.yml up -d
    ```

# Production Environment

The production environment is defined in the `docker-compose.production.yml` file.

It doesn't use volumes nor depends on external files for environment variables or anything. It only returns a reference to the `Dockerfile-production` in the `./service` folder, so the [microservices](http://github.com/armand1m/microservices) environment can extend the compose file to a main one, and use it to build the image and only run it.