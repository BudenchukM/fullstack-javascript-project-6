export default (app) => {
  const Status = app.objection.models.status;

  app
    .get('/statuses', { preValidation: app.authenticate }, async (request, reply) => {
      const statuses = await Status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { preValidation: app.authenticate }, (request, reply) => {
      const status = new Status();
      reply.render('statuses/new', { status });
      return reply;
    })
    .get('/statuses/:id/edit', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const status = await Status.query().findById(id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .post('/statuses', { preValidation: app.authenticate }, async (request, reply) => {
      try {
        const status = await Status.fromJson(request.body.data);
        await status.$query().insert();
        request.flash('info', request.t('flash.statuses.create.success'));
        reply.redirect('/statuses');
      } catch ({ data }) {
        request.flash('error', request.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status: request.body.data, errors: data });
      }
      return reply;
    })
    .patch('/statuses/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const status = await Status.query().findById(id);
      const { data } = request.body;

      try {
        await status.$query().patch(data);
        request.flash('info', request.t('flash.statuses.update.success'));
        reply.redirect('/statuses');
      } catch (errors) {
        request.flash('error', request.t('flash.statuses.update.error'));
        const errorData = errors.data || errors;
        reply.render('statuses/edit', { status, errors: errorData });
      }
      return reply;
    })
    .delete('/statuses/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const status = await Status.query().findById(id);

      try {
        await status.$query().delete();
        request.flash('info', request.t('flash.statuses.delete.success'));
        reply.redirect('/statuses');
      } catch (error) {
        console.error(error);
        request.flash('error', request.t('flash.statuses.delete.error'));
        reply.redirect('/statuses');
      }
      return reply;
    });
};
