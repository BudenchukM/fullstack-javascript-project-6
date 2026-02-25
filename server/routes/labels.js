import i18next from 'i18next';

export default (app) => {
  const { label: Label } = app.objection.models;

  // INDEX
  app.get('/labels', { preValidation: app.authenticate }, async (request, reply) => {
    const labels = await Label.query();
    return reply.render('labels/index', { labels });
  });

  // NEW
  app.get('/labels/new', { preValidation: app.authenticate }, (request, reply) => {
    const labelItem = new Label();
    return reply.render('labels/new', { label: labelItem, errors: {} });
  });

  // EDIT
  app.get('/labels/:id/edit', { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const labelItem = await Label.query().findById(id);
    return reply.render('labels/edit', { label: labelItem, errors: {} });
  });

  // CREATE
  app.post('/labels', { preValidation: app.authenticate }, async (request, reply) => {
    const labelItem = new Label();
    labelItem.$set(request.body.data);

    try {
      await Label.query().insert(request.body.data);

      request.flash('info', i18next.t('flash.labels.create.success'));
      return reply.redirect('/labels');
    } catch (error) {
      request.flash('error', i18next.t('flash.labels.create.error'));
      return reply.render('labels/new', {
        label: labelItem,
        errors: error.data || {},
      });
    }
  });

  // UPDATE
  app.patch('/labels/:id', { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const labelItem = await Label.query().findById(id);

    try {
      await labelItem.$query().patch(request.body.data);

      request.flash('info', i18next.t('flash.labels.update.success'));
      return reply.redirect('/labels');
    } catch (error) {
      request.flash('error', i18next.t('flash.labels.update.error'));
      return reply.render('labels/edit', {
        label: labelItem,
        errors: error.data || {},
      });
    }
  });

  // DELETE
  app.delete('/labels/:id', { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const labelItem = await Label.query().findById(id);

    try {
      await labelItem.$query().delete();

      request.flash('info', i18next.t('flash.labels.delete.success'));
      return reply.redirect('/labels');
    } catch (error) {
      request.flash('error', i18next.t('flash.labels.delete.error'));
      return reply.redirect('/labels');
    }
  });
};
