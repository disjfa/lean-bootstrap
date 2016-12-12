let router      = require('express').Router();
let sass        = require('node-sass');
let fs          = require('fs');
let path        = require('path');
let parseData   = require('../modules/projects/parser');
let projectData = require('../modules/projects/project');


router.get('/', (req, res) => {
    let projects = req.database.getCollection('projects');

    res.render('projects/index', {
        title: 'Projects',
        projects: projects.find()
    });
});

router.get('/create', (req, res) => {
    res.render('projects/create', {
        title: 'Create project',
    });
});

router.post('/', (req, res) => {
    let projects = req.database.getCollection('projects');
    if(req.body.name) {
        let project = projects.insert({
            name:req.body.name
        });

        res.redirect('/projects/' + project.$loki);
    }
});

router.get('/:projectid', (req, res) => {
    let projects = req.database.getCollection('projects');
    let project  = projects.get(req.params.projectid);

    parseData.parseFile(project).then((varData) => {
        res.render('projects/show', {
            title: 'Projects',
            project: project,
            varData: varData,
            groupData: parseData.groupData(varData)
        });
    });
});

router.get('/:projectid/:page', (req, res) => {
    let projects = req.database.getCollection('projects');
    let project  = projects.get(req.params.projectid);

    res.render('projects/edit', {
        layout: 'project',
        title: 'Projects',
        cssFile: projectData.getCss(req.publicDir, project)
    });
});

router.post('/:projectid', (req, res) => {
    let projects = req.database.getCollection('projects');
    let project  = projects.get(req.params.projectid);

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
