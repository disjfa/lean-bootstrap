function create(app) {
    app.use('/', require('./routes/vue'));
    app.use('/index', require('./routes/default'));
    app.use('/about', require('./routes/about'));
    app.use('/database', require('./routes/database'));
    app.use('/projects', require('./routes/projects'));

    app.use((req, res, next) => {
        res.status(404);
        res.render('404', {title: '404', message: 'This page does not exist.'});
    });
}


module.exports = {
    create: create
};
