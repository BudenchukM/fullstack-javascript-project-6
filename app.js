const path = require('path');
const fastify = require('fastify')({ logger: true });

const view = require('@fastify/view');
const fastifyStatic = require('@fastify/static');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');

// i18n
i18next.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  backend: {
    loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
  },
});

fastify.decorate('t', i18next.t.bind(i18next));

// static (bootstrap js/css later)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// pug
fastify.register(view, {
  engine: { pug: require('pug') },
  root: path.join(__dirname, 'views'),
});

// routes
fastify.get('/', async (req, reply) => {
  return reply.view('index.pug', { t: fastify.t });
});

module.exports = fastify;
