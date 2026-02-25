import i18next from 'i18next';

export default (app) => {
  const { status: Status } = app.objection.models;

  // INDEX
  app.get('/statuses', { preValidation: app.authenticate }, async (request, reply) => {
    const statuses = await Status.query();
    return reply.render('statuses/index', { statuses });
  });

  // NEW
  app.get('/statuses/new', { preValidation: app.authenticate }, (request, reply) => {
    const statusItem = new Status();
    return reply.render('statuses/new', { status: statusItem, errors: {} });
  });

  // EDIT
  app.get('/statuses/:id/edit', { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const statusItem = await Status.query().findById(id);
    return reply.render('statuses/edit', { status: statusItem, errors: {} });
  });

  // CREATE
  app.post('/statuses', { preValidation: app.authenticate }, async (request, reply) => {
    const statusItem = new Status();
    statusItem.$set(request.body.data);

    try {
      const validData = Status.fromJson(request.body.data);
      await Status.query().insert(validData);

      request.flash('info', i18next.t('flash.statuses.create.success'));
      return reply.redirect('/statuses');
    } catch (error) {
      request.flash('error', i18next.t('flash.statuses.create.error'));
      return reply.render('statuses/new', {
        status: statusItem,
        errors: error.data || {},
      });
    }
  });

  // UPDATE
  app.patch('/statuses/:id', { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const statusItem = await Status.query().findById(id);

    try {
      await statusItem.$query().patch(request.body.data);

      request.flash('info', i18next.t('flash.statuses.update.success'));
      return reply.redirect('/statuses');
    } catch (error) {
      request.flash('error', i18next.t('flash.statuses.update.error'));
      return reply.render('statuses/edit', {
        status: statusItem,
        errors: error.data || {},
      });
    }
  });

  // DELETE
  app.delete('/statuses/:id', { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const statusItem = await Status.query().findById(id);

    try {
      await statusItem.$query().delete();

      request.flash('info', i18next.t('flash.statuses.delete.success'));
      return reply.redirect('/statuses');
    } catch (error) {
      request.flash('error', i18next.t('flash.statuses.delete.error'));
      return reply.redirect('/statuses');
    }
  });
};
