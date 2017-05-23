const passport = require('passport');
const uuid = require('uuid/v4');

function create(app) {
  app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

  app.get('/auth/github/callback',
    passport.authenticate('github', { successRedirect: '/', failureRedirect: '/#/login' }));
}

module.exports = {
  create,
};
