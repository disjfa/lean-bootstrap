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

router.get('/:projectid', (req, res) => {
    let projects = req.database.getCollection('projects');
    let project  = projects.get(req.params.projectid);

    parseData.parseFile(project).then((varData) => {


        res.render('projects/edit', {
            title: 'Projects',
            project: project,
            varData: varData,
            groupData: parseData.groupData(varData),
            cssFile: projectData.getCss(req.publicDir, project)
        });
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
                if (posted !== varItem.value) {
                    changed.push(varItem.name + ': ' + posted);
                }
            }
        }

        project.content = changed.join(';\n\r') + ';';
        projects.update(project);

        projectData.render(req.dataDir, req.publicDir, project)
            .then(() => {
                res.redirect('/projects/' + project.$loki);
            }, function(err) {
                res.redirect('/projects/' + project.$loki + '?error=' + err.message);
            });
    });
});

module.exports = router;
