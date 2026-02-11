// routes/tasks.js
const fastifyPlugin = require('fastify-plugin');
const Task = require('../models/task');

module.exports = fastifyPlugin(async (fastify) => {
  const { models } = fastify.objection;
  models.task = Task;

  // Список задач
  fastify.get('/tasks', async (req, reply) => {
    const tasks = await models.task.query();
    return reply.view('tasks/index.pug', { tasks, t: fastify.t });
  });

  // Форма создания
  fastify.get('/tasks/new', async (req, reply) => {
    const labels = await Label.query();
      reply.render('tasks/new', {
        task,
        labels,
    });
    return reply.view('tasks/new.pug', { t: fastify.t });
  });

  // Создание задачи
  fastify.post('/tasks', async (req, reply) => {
    try {
      const { name, description, statusId, executorId } = req.body.data;
      await models.task.query().insert({
        name,
        description,
        statusId,
        creatorId: req.session.userId,
        executorId: executorId || null,
      });
      req.flash('success', fastify.t('task_created'));
      return reply.redirect('/tasks');
    } catch (err) {
      req.flash('error', fastify.t('task_create_error'));
      return reply.redirect('/tasks/new');
    }
  });

  // Форма редактирования
  fastify.get('/tasks/:id/edit', async (req, reply) => {
    const task = await models.task.query().findById(req.params.id);
    if (!task) return reply.code(404).send('Not Found');
    const labels = await Label.query();
    reply.render('tasks/new', {
      task,
      labels,
    });
    return reply.view('tasks/edit.pug', { task, t: fastify.t });
  });

  // Обновление задачи
  fastify.patch('/tasks/:id', async (req, reply) => {
    try {
      const { name, description, statusId, executorId } = req.body.data;
      await models.task.query().findById(req.params.id).patch({
        name,
        description,
        statusId,
        executorId: executorId || null,
      });
      req.flash('success', fastify.t('task_updated'));
      return reply.redirect('/tasks');
    } catch (err) {
      req.flash('error', fastify.t('task_update_error'));
      return reply.redirect(`/tasks/${req.params.id}/edit`);
    }
  });

  // Удаление задачи (только создатель)
  fastify.delete('/tasks/:id', async (req, reply) => {
    try {
      const task = await models.task.query().findById(req.params.id);
      if (task.creatorId !== req.session.userId) {
        req.flash('error', fastify.t('task_delete_forbidden'));
        return reply.redirect('/tasks');
      }
      await models.task.query().deleteById(req.params.id);
      req.flash('success', fastify.t('task_deleted'));
      return reply.redirect('/tasks');
    } catch (err) {
      req.flash('error', fastify.t('task_delete_error'));
      return reply.redirect('/tasks');
    }
  });
});
