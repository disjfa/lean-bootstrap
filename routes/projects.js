let router      = require('express').Router();
let sass        = require('node-sass');
let fs          = require('fs');
let path        = require('path');
let parseData   = require('../modules/projects/parser');
let projectData = require('../modules/projects/project');
let uuid        = require('uuid/v4');

router.get('/', (req, res) => {
    let projects = req.database.getCollection('projects');
    res.send(projects.data);
});

router.get('/create', (req, res) => {
    res.render('projects/create', {
        title: 'Create project',
    });
});

router.post('/', (req, res) => {
    let projects = req.database.getCollection('projects');
    if (req.body.name) {
        let project = projects.insert({
            uuid: uuid(),
            name: req.body.name,
        });

        parseData.parseFile(project).then(varData => {
            res.send({
                project,
                varData,
            });
        });
    }
});

router.get('/:uuid', (req, res) => {
    let projects = req.database.getCollection('projects');
    let project  = projects.findOne({uuid: req.params.uuid});

    parseData.parseFile(project).then(varData => {
        res.send({
            project,
            varData,
        });
    });
});

router.get('/:uuid/:page', (req, res) => {
    let projects = req.database.getCollection('projects');
    let project  = projects.findOne({uuid: req.params.uuid});
    let pagename = req.params.page.toLowerCase().replace(/[^a-z0-9]/g, '');

    let pageslug = 'projects/pages/home';
    try {
        let page = fs.lstatSync(req.viewsDir + '/projects/pages/' + pagename + '.hbs');
        if (page.isFile()) {
            pageslug = 'projects/pages/' + pagename;
        }
    }
    catch (err) {
        // nope
    }

    res.render(pageslug, {
        layout: 'project',
        title: 'Projects',
        project: project,
        cssFile: projectData.getCss(req.publicDir, project)
    });
});

router.post('/:uuid/data', (req, res) => {
    let projects = req.database.getCollection('projects');
    let project  = projects.findOne({uuid: req.params.uuid});

    parseData.parseFile().then((varData) => {
        let changed = [];
        for (varItem of varData) {
            let posted = req.body[varItem.name];
            if (posted) {
                changed.push(varItem.name + ': ' + posted);
            }
        }
        const content   = project.content;
        project.content = changed.join(';\n') + ';';
        projectData.render(req.dataDir, req.publicDir, project)
            .then(() => {
                projects.update(project);
                res.send({
                    message: 'success',
                    project,
                });
            })
            .catch(error => {
                project.content = content;
                res.status(400).send({
                    message: 'failed',
                    error,
                });
            });
    });
});


router.post('/:uuid', (req, res) => {
    let projects = req.database.getCollection('projects');
    let project  = projects.findOne({uuid: req.params.uuid});

    parseData.parseFile().then((varData) => {
        let changed = [];
        for (varItem of varData) {
            let posted = req.body['field[' + varItem.name + ']'];
            if (posted) {
                changed.push(varItem.name + ': ' + posted);
            }
        }

        project.content = changed.join(';\n') + ';';
        projects.update(project);

        projectData.render(req.dataDir, req.publicDir, project)
            .then(() => {
                res.redirect('/projects/' + project.$loki);
            }, function (err) {
                res.redirect('/projects/' + project.$loki + '?error=' + err.message);
            });
    });
});

module.exports = router;
