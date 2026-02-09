async function sessionRoutes(app) {
  const { models } = app.objection;

  app.get('/session/new', async (req, reply) => {
    return reply.view('session/new.pug');
  });

  app.post('/session', async (req, reply) => {
    const { email, password } = req.body.data;
    const user = await models.user.query().findOne({ email });
    if (!user || user.passwordDigest !== require('../lib/secure.cjs')(password)) {
      req.flash('error', 'Invalid email or password');
      return reply.redirect('/session/new');
    }
    req.session.userId = user.id;
    req.flash('success', 'Successfully signed in');
    reply.redirect('/');
  });

  app.delete('/session', async (req, reply) => {
    req.session.userId = null;
    req.flash('success', 'Signed out');
    reply.redirect('/');
  });
}

module.exports = sessionRoutes;
