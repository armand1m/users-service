FROM alpine
RUN apk add --update --no-cache nodejs
RUN npm i nodemon -g

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /src/service && cp -a /tmp/package.json /tmp/node_modules /src/

VOLUME /src/service
WORKDIR /src

EXPOSE 80

ENTRYPOINT ["nodemon"]
CMD ["./service/index.js"]
