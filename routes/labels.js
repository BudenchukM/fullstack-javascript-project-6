
const fastifyPlugin = require('fastify-plugin');
const Label = require('../models/label');

module.exports = fastifyPlugin(async (fastify) => {
  const { models } = fastify.objection;
  models.label = Label;

  // Список всех меток
  fastify.get('/labels', async (req, reply) => {
  const labels = await Label.query();
  return reply.render('labels/index', { labels });
});

  // Форма создания новой метки
 fastify.get('/labels/new', (req, reply) =>
  reply.render('labels/new', { label: {} })
);

  // Создание метки
  fastify.post('/labels', async (req, reply) => {
  const label = await Label.query().insert(req.body.data);
  req.flash('success', 'Метка успешно создана');
  reply.redirect('/labels');
});


  // Форма редактирования
  fastify.get('/labels/:id/edit', async (req, reply) => {
  const label = await Label.query().findById(req.params.id);
  return reply.render('labels/edit', { label });
});


  // Обновление метки
 fastify.patch('/labels/:id', async (req, reply) => {
  await Label.query().patchAndFetchById(req.params.id, req.body.data);
  req.flash('success', 'Метка успешно изменена');
  reply.redirect('/labels');
});


  // Удаление метки
 fastify.delete('/labels/:id', async (req, reply) => {
  const label = await Label.query()
    .findById(req.params.id)
    .withGraphFetched('tasks');

  if (label.tasks.length > 0) {
    req.flash('error', 'Невозможно удалить метку, потому что она используется');
    return reply.redirect('/labels');
  }

  await Label.query().deleteById(req.params.id);
  req.flash('success', 'Метка успешно удалена');
  reply.redirect('/labels');
});

});
