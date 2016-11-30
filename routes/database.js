let router = require('express').Router();


router.get('/', (req, res) => {
    let coll  = req.database.getCollection('users');
    let users = coll.chain().simplesort('name').data();

    render(res, users);
});

router.get('/find/:search', (req, res) => {
    let search = req.params.search;

    let coll  = req.database.getCollection('users');
    let users = coll.find({name: {'$regex': new RegExp(search, 'i')}});

    render(res, users);
});

router.get('/edit/:userid', (req, res) => {
    let userid = req.params.userid;

    let coll = req.database.getCollection('users');
    let user = coll.get(userid);

    res.render('database/edit', {
        user: user
    });
});

router.post('/edit/:userid', (req, res) => {
    let userid = req.params.userid;

    let coll = req.database.getCollection('users');
    let user = coll.get(userid);
    user.name = req.body.name;
    user.city = req.body.city;
    user.state = req.body.state;
    user.zip = req.body.zip;
    coll.update(user);

    res.redirect('/database/edit/' + userid);
});

router.get('/structure', (req, res) => {
    let coll = req.database.getCollection('users');
    render(res, {}, coll);
});


function render(res, users, struct) {
    res.render('database/index', {
        title: 'Loki Database',
        users: users,
        struct: struct ? JSON.stringify(struct, null, 2) : ''
    });
}


module.exports = router;
