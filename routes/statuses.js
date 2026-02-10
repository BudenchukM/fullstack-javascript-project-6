const fastifyPlugin = require('fastify-plugin');
const Status = require('../models/task-status');


module.exports = fastifyPlugin(async (fastify) => {
const { models } = fastify.objection;
models.status = Status;


fastify.get('/statuses', async (req, reply) => {
const statuses = await models.status.query();
return reply.view('statuses/index.pug', { statuses });
});


fastify.get('/statuses/new', async (req, reply) => {
return reply.view('statuses/new.pug');
});


fastify.post('/statuses', async (req, reply) => {
  try {
    const status = await models.status.build(req.body.data).save();

    req.flash('info', i18next.t('flash.statuses.create.success'));

    reply.redirect(fastify.reverse('statuses'));
  } catch (e) {
    req.flash('error', i18next.t('flash.statuses.create.error'));
    reply.view('statuses/new');
  }
});



fastify.get('/statuses/:id/edit', async (req, reply) => {
const status = await models.status.query().findById(req.params.id);
if (!status) return reply.code(404).send('Not found');
return reply.view('statuses/edit.pug', { status });
});


fastify.patch('/statuses/:id', async (req, reply) => {
try {
const { name } = req.body.data;
await models.status.query().findById(req.params.id).patch({ name });
req.flash('success', fastify.t('status_updated'));
return reply.redirect('/statuses');
} catch (e) {
req.flash('error', fastify.t('status_update_error'));
return reply.redirect(`/statuses/${req.params.id}/edit`);
}
});


fastify.delete('/statuses/:id', async (req, reply) => {
try {
await models.status.query().deleteById(req.params.id);
req.flash('success', fastify.t('status_deleted'));
return reply.redirect('/statuses');
} catch (e) {
req.flash('error', fastify.t('status_delete_error'));
return reply.redirect('/statuses');
}
});
});