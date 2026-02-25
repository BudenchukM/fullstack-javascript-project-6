import i18next from 'i18next';

export default (app) => {
  const { label } = app.objection.models;

  // INDEX
  app.get('/labels', { preValidation: app.authenticate }, async (request, reply) => {
    const labels = await label.query();
    return reply.render('labels/index', { labels });
  });

  // NEW
  app.get('/labels/new', { preValidation: app.authenticate }, (request, reply) => {
    const labelItem = new label();
    return reply.render('labels/new', { label: labelItem });
  });

  // EDIT
  app.get('/labels/:id/edit', { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const labelItem = await label.query().findById(id);
    return reply.render('labels/edit', { label: labelItem });
  });

  // CREATE
  app.post('/labels', { preValidation: app.authenticate }, async (request, reply) => {
    const labelItem = new label();
    labelItem.$set(request.body.data);

    try {
      await label.query().insert(request.body.data);

      request.flash('info', i18next.t('flash.labels.create.success'));
      return reply.redirect('/labels');
    } catch (error) {
      request.flash('error', i18next.t('flash.labels.create.error'));
      return reply.render('labels/new', {
        label: labelItem,
        errors: error.data,
      });
    }
  });

  // UPDATE
  app.patch('/labels/:id', { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const labelItem = await label.query().findById(id);

    try {
      await labelItem.$query().patch(request.body.data);

      request.flash('info', i18next.t('flash.labels.update.success'));
      return reply.redirect('/labels');
    } catch (error) {
      request.flash('error', i18next.t('flash.labels.update.error'));
      return reply.render('labels/edit', {
        label: labelItem,
        errors: error.data,
      });
    }
  });

  // DELETE
  app.delete('/labels/:id', { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const labelItem = await label.query().findById(id);

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
