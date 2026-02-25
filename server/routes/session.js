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
      const signInForm = request.body.data;
      request.flash('error', request.t('flash.session.create.error'));
      return reply.redirect('/session/new');
    }
    await request.logIn(user);
    request.flash('success', request.t('flash.session.create.success'));
    return reply.redirect('/');
  }));

  app.delete('/session', async (request, reply) => {
    await request.logOut();
    request.flash('info', request.t('flash.session.delete.success'));
    return reply.redirect('/');
  });
};
