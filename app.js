// app.js
const fastify = require('fastify')({ logger: true });

fastify.get('/', async (request, reply) => {
  return 'Привет, Hexlet!';
});

module.exports = fastify;
