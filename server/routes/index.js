let github = require('./github');

function create (app) {
  app.use('/', require('./vue'))
  app.use('/user', require('./user'))
  app.use('/projects', require('./projects'))
  github.create(app);

  app.use((req, res, next) => {
    res.status(404)
    res.render('404', { title: '404', message: 'This page does not exist.' })
  })
}

module.exports = {
  create: create
}
