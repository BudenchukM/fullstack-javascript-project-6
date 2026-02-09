// routes/statuses.js
const { Model } = require('objection');
const Status = require('../models/task-status'); // убедись, что модель есть
const fastifyPlugin = require('fastify-plugin');

module.exports = fastifyPlugin(async (fastify) => {
  const { models } = fastify.objection;
  models.status = Status;

  // Список всех статусов
  fastify.get('/statuses', async (req, reply) => {
    const statuses = await models.status.query();
    return reply.view('statuses/index.pug', { statuses, t: fastify.t });
  });

  // Форма создания нового статуса
  fastify.get('/statuses/new', async (req, reply) => {
    return reply.view('statuses/new.pug', { t: fastify.t });
  });

  // Создание статуса
  fastify.post('/statuses', async (req, reply) => {
    try {
      const { name } = req.body.data; // form должен иметь name="data[name]"
      await models.status.query().insert({ name });
      req.flash('success', fastify.t('status_created'));
      return reply.redirect('/statuses');
    } catch (err) {
      req.flash('error', fastify.t('status_create_error'));
      return reply.redirect('/statuses/new');
    }
  });

  // Форма редактирования
  fastify.get('/statuses/:id/edit', async (req, reply) => {
    const status = await models.status.query().findById(req.params.id);
    if (!status) return reply.code(404).send('Not Found');
    return reply.view('statuses/edit.pug', { status, t: fastify.t });
  });

  // Обновление статуса
  fastify.patch('/statuses/:id', async (req, reply) => {
    try {
      const { name } = req.body.data;
      await models.status.query().findById(req.params.id).patch({ name });
      req.flash('success', fastify.t('status_updated'));
      return reply.redirect('/statuses');
    } catch (err) {
      req.flash('error', fastify.t('status_update_error'));
      return reply.redirect(`/statuses/${req.params.id}/edit`);
    }
  });

  // Удаление
  fastify.delete('/statuses/:id', async (req, reply) => {
    try {
      await models.status.query().deleteById(req.params.id);
      req.flash('success', fastify.t('status_deleted'));
      return reply.redirect('/statuses');
    } catch (err) {
      req.flash('error', fastify.t('status_delete_error'));
      return reply.redirect('/statuses');
    }
  });
});
