// app.js
const path = require('path');
const fastify = require('fastify')({ logger: true });
const view = require('@fastify/view');
const fastifyStatic = require('@fastify/static');
const formbody = require('@fastify/formbody');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const { Model } = require('objection');
const Knex = require('knex');

// i18n
i18next.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  backend: {
    loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
  },
});
fastify.decorate('t', i18next.t.bind(i18next));

// static (Bootstrap, CSS, JS)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// form parsing
fastify.register(formbody);

// pug
fastify.register(view, {
  engine: { pug: require('pug') },
  root: path.join(__dirname, 'views'),
});

// knex + objection (SQLite dev)
const knex = Knex({
  client: 'sqlite3',
  connection: { filename: './dev.sqlite3' },
  useNullAsDefault: true,
});
Model.knex(knex);
fastify.decorate('objection', { knex, models: {} });

// make t available in all views
fastify.addHook('preHandler', (req, reply, done) => {
  reply.locals = { t: fastify.t };
  done();
});

// роут главной страницы
fastify.get('/', async (req, reply) => {
  return reply.view('index.pug');
});

// подключение роутов (users и statuses)
fastify.register(require('./routes/users'));
fastify.register(require('./routes/statuses'));

module.exports = fastify;
