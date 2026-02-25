export default (app) => {
  const Label = app.objection.models.label;

  app
    .get('/labels', { preValidation: app.authenticate }, async (request, reply) => {
      const labels = await Label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { preValidation: app.authenticate }, (request, reply) => {
      const label = new Label();
      reply.render('labels/new', { label });
      return reply;
    })
    .get('/labels/:id/edit', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const label = await Label.query().findById(id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .post('/labels', { preValidation: app.authenticate }, async (request, reply) => {
      const label = new Label();
      label.$set(request.body.data);

      try {
        await label.$query().insert();
        request.flash('info', request.t('flash.labels.create.success'));
        reply.redirect('/labels');
      } catch ({ data }) {
        request.flash('error', request.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: data });
      }
      return reply;
    })
    .patch('/labels/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const label = await Label.query().findById(id);
      const { data } = request.body;

      try {
        label.$set(data);
        await label.$query().patch(data);
        request.flash('info', request.t('flash.labels.update.success'));
        reply.redirect('/labels');
      } catch (errors) {
        request.flash('error', request.t('flash.labels.update.error'));
        const errorData = errors.data || errors;
        reply.render('labels/edit', { label, errors: errorData });
      }
      return reply;
    })
    .delete('/labels/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const label = await Label.query().findById(id);

      try {
        await label.$query().delete();
        request.flash('info', request.t('flash.labels.delete.success'));
        reply.redirect('/labels');
      } catch (error) {
        console.error(error);
        request.flash('error', request.t('flash.labels.delete.error'));
        reply.redirect('/labels');
      }
      return reply;
    });
};
