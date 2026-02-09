const path = require('path');
const fastify = require('fastify')({ logger: true });
const view = require('@fastify/view');
const fastifyStatic = require('@fastify/static');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const { Model } = require('objection');
const Knex = require('knex');

// ---------------- i18n ----------------
i18next.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  backend: {
    loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
  },
});

fastify.decorate('t', i18next.t.bind(i18next));

// ---------------- static ----------------
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// ---------------- pug ----------------
fastify.register(view, {
  engine: { pug: require('pug') },
  root: path.join(__dirname, 'views'),
});

// делаем t доступным во ВСЕХ шаблонах
fastify.addHook('preHandler', (req, reply, done) => {
  reply.locals = { t: fastify.t };
  done();
});

// ---------------- database ----------------
const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'dev.sqlite3'),
  },
  useNullAsDefault: true,
});

Model.knex(knex);

// подключаем модели
const User = require('./models/User');

fastify.decorate('objection', {
  knex,
  models: { User },
});

// ---------------- routes ----------------
fastify.get('/', async (req, reply) => reply.view('index.pug'));

// ВАЖНО — префикс
fastify.register(require('./routes/users'), { prefix: '/users' });

module.exports = fastify;
