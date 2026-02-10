// app.js
const path = require('path');
const fastify = require('fastify')({ logger: true });
const view = require('@fastify/view');
const fastifyStatic = require('@fastify/static');
const formbody = require('@fastify/formbody');
const cookie = require('@fastify/cookie');
const session = require('@fastify/session');
const flash = require('@fastify/flash');
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

// Static files (Bootstrap CSS/JS)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// Form parsing
fastify.register(formbody);

// Cookies
fastify.register(cookie);

// Session
fastify.register(session, {
  secret: process.env.SESSION_SECRET || 'a_very_long_secret_key_at_least_32_chars',
  cookie: { secure: false },
});

// Flash messages
fastify.register(flash);

// Pug
fastify.register(view, {
  engine: { pug: require('pug') },
  root: path.join(__dirname, 'views'),
});

// Knex + Objection
const knex = Knex({
  client: 'sqlite3',
  connection: { filename: './dev.sqlite3' },
  useNullAsDefault: true,
});
Model.knex(knex);
fastify.decorate('objection', { knex, models: {} });

// Make t, flash and currentUser available in all views
fastify.addHook('preHandler', (req, reply, done) => {
  reply.locals = {
    t: fastify.t,
    flash: req.flash ? req.flash() : {},
    currentUser: req.session.userId || null,
  };
  done();
});

// Главная страница
fastify.get('/', async (req, reply) => reply.view('index.pug'));

// Подключение роутов
fastify.register(require('./routes/users'));
fastify.register(require('./routes/statuses'));
fastify.register(require('./routes/tasks'));

// Обработка 404
fastify.setNotFoundHandler((req, reply) => {
  reply.status(404).view('404.pug');
});

module.exports = fastify;
