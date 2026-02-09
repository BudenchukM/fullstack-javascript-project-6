// routes/users.js
const { Model } = require('objection');
const User = require('../models/User');

module.exports = async function (fastify) {
  const { knex, models } = fastify.objection;
  models.user = User;

  // список всех пользователей
  fastify.get('/users', async (req, reply) => {
    const users = await User.query();
    return reply.view('users/index.pug', { users, t: fastify.t });
  });

  // страница регистрации
  fastify.get('/users/new', async (req, reply) => {
    return reply.view('users/new.pug', { t: fastify.t });
  });

  // создание пользователя
  fastify.post('/users', async (req, reply) => {
    const { firstName, lastName, email, password } = req.body.data;
    await User.query().insert({ firstName, lastName, email, password });
    return reply.redirect('/users');
  });
};
