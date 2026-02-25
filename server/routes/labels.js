import i18next from 'i18next';

export default (app) => {
  const objectionModels = app.objection.models;
  const modelName = 'label';
  const routePrefix = 'labels';

  app
    .get(`/${routePrefix}`, { preValidation: app.authenticate }, async (request, reply) => {
      const items = await objectionModels[modelName].query();
      reply.render(`${routePrefix}/index`, { [routePrefix]: items });
    })
    .get(`/${routePrefix}/new`, { preValidation: app.authenticate }, (request, reply) => {
      const item = new objectionModels[modelName]();
      reply.render(`${routePrefix}/new`, { [modelName]: item });
    })
    .get(`/${routePrefix}/:id/edit`, { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const item = await objectionModels[modelName].query().findById(id);
      reply.render(`${routePrefix}/edit`, { [modelName]: item });
    })
    .post(`/${routePrefix}`, { preValidation: app.authenticate }, async (request, reply) => {
      const item = new objectionModels[modelName]();
      item.$set(request.body.data);

      try {
        await objectionModels[modelName].query().insert(request.body.data);
        request.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(`/${routePrefix}`);
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.labels.create.error'));
        reply.render(`${routePrefix}/new`, { [modelName]: item, errors: data });
      }
    })
    .patch(`/${routePrefix}/:id`, { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const item = await objectionModels[modelName].query().findById(id);
      try {
        await item.$query().patch(request.body.data);
        request.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect(`/${routePrefix}`);
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.labels.update.error'));
        reply.render(`${routePrefix}/edit`, { [modelName]: item, errors: data });
      }
    })
    .delete(`/${routePrefix}/:id`, { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const item = await objectionModels[modelName].query().findById(id);
      try {
        await item.$query().delete();
        request.flash('info', i18next.t('flash.labels.delete.success'));
        reply.redirect(`/${routePrefix}`);
      } catch (error) {
        console.error(error);
        request.flash('error', i18next.t('flash.labels.delete.error'));
        reply.redirect(`/${routePrefix}`);
      }
    });
};
