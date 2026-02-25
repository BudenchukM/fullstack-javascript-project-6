import i18next from 'i18next';

export default (app) => {
  app.get('/session/new', (request, reply) => {
    const signInForm = {};
    reply.render('session/new', { signInForm });
    return reply;
  });

  app.post('/session', app.fp.authenticate('form', async (request, reply, err, user) => {
    if (err) {
      request.log.error(err);
      return reply.code(500).send('Internal Server Error');
    }
    if (!user) {
      // ВАЖНО: не редиректим, а рендерим форму с ошибками валидации
      const signInForm = request.body.data;
      const errors = {
        email: [{
          message: i18next.t('alerts.signInError'), // "Неверный email или пароль" из локалей
        }],
      };
      return reply.render('session/new', { signInForm, errors });
    }
    await request.logIn(user);
    request.flash('success', i18next.t('flash.session.create.success'));
    return reply.redirect('/');
  }));

  app.delete('/session', async (request, reply) => {
    await request.logOut();
    request.flash('info', i18next.t('flash.session.delete.success'));
    return reply.redirect('/');
  });
};
