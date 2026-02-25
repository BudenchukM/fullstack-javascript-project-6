import i18next from 'i18next';

export default (app) => {
  const objectionModels = app.objection.models;
  const modelName = 'status';
  const routePrefix = 'statuses';

  // GET /statuses — список
  app.get(`/${routePrefix}`, { preValidation: app.authenticate }, async (request, reply) => {
    const items = await objectionModels[modelName].query();
    return reply.render(`${routePrefix}/index`, { [routePrefix]: items });
  });

  // GET /statuses/new — форма создания
  app.get(`/${routePrefix}/new`, { preValidation: app.authenticate }, (request, reply) => {
    const item = new objectionModels[modelName]();
    return reply.render(`${routePrefix}/new`, { [modelName]: item });
  });

  // GET /statuses/:id/edit — форма редактирования
  app.get(`/${routePrefix}/:id/edit`, { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const item = await objectionModels[modelName].query().findById(id);
    return reply.render(`${routePrefix}/edit`, { [modelName]: item });
  });

  // POST /statuses — создание
  app.post(`/${routePrefix}`, { preValidation: app.authenticate }, async (request, reply) => {
    const item = new objectionModels[modelName]();
    item.$set(request.body.data);

    try {
      const validItem = await objectionModels[modelName].fromJson(request.body.data);
      await objectionModels[modelName].query().insert(validItem);
      request.flash('info', i18next.t('flash.statuses.create.success'));
      return reply.redirect(`/${routePrefix}`);
    } catch ({ data }) {
      request.flash('error', i18next.t('flash.statuses.create.error'));
      return reply.render(`${routePrefix}/new`, { [modelName]: item, errors: data });
    }
  });

  // PATCH /statuses/:id — обновление
  app.patch(`/${routePrefix}/:id`, { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const item = await objectionModels[modelName].query().findById(id);

    try {
      await item.$query().patch(request.body.data);
      request.flash('info', i18next.t('flash.statuses.update.success'));
      return reply.redirect(`/${routePrefix}`);
    } catch ({ data }) {
      request.flash('error', i18next.t('flash.statuses.update.error'));
      return reply.render(`${routePrefix}/edit`, { [modelName]: item, errors: data });
    }
  });

  // DELETE /statuses/:id — удаление
  app.delete(`/${routePrefix}/:id`, { preValidation: app.authenticate }, async (request, reply) => {
    const { id } = request.params;
    const item = await objectionModels[modelName].query().findById(id);

    try {
      await item.$query().delete();
      request.flash('info', i18next.t('flash.statuses.delete.success'));
      return reply.redirect(`/${routePrefix}`);
    } catch (error) {
      console.error(error);
      request.flash('error', i18next.t('flash.statuses.delete.error'));
      return reply.redirect(`/${routePrefix}`);
    }
  });
};
