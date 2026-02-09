const User = require('../models/User');


module.exports = async function (fastify, opts) {
// список пользователей
fastify.get('/', async (req, reply) => {
const users = await User.query();
return reply.view('users/index.pug', { users });
});


// регистрация
fastify.get('/new', async (req, reply) => {
return reply.view('users/new.pug');
});


fastify.post('/', async (req, reply) => {
const data = req.body.data;
await User.query().insert(data);
return reply.redirect('/users');
});
};
