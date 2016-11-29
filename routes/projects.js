let router = require('express').Router();
let sass   = require('node-sass');
let fs     = require('fs');
let path   = require('path');

router.get('/', (req, res) => {
    let projects = req.database.getCollection('projects');

    res.render('projects/index', {
        title: 'Projects',
        projects: projects.find()
    });
});

router.get('/:projectid', (req, res) => {
    let projects = req.database.getCollection('projects');

    fs.readFile(require.resolve('bootstrap/scss/_variables.scss'), (err, data) => {
        if (err) throw err;
        let bsdata = data.toString();

        res.render('projects/edit', {
            title: 'Projects',
            project: projects.get(req.params.projectid),
            bsdata: bsdata
        });
    });
});

router.post('/:projectid', (req, res) => {
    let projects    = req.database.getCollection('projects');
    let project     = projects.get(req.params.projectid);
    project.content = req.body.content;

    let projectDir = req.dataDir + '/' + req.params.projectid;
    if (false === fs.existsSync(projectDir)) {
        fs.mkdir(projectDir);
    }
    let outDir = projectDir + '/css';
    if (false === fs.existsSync(outDir)) {
        fs.mkdir(outDir);
    }

    let outputFile = outDir + '/project.css';
    projectDir     = req.dataDir + '/' + req.params.projectid + '/scss';
    if (false === fs.existsSync(projectDir)) {
        fs.mkdir(projectDir);
    }
    let projectFile  = projectDir + '/project.scss';
    let variableFile = projectDir + '/_variables.scss';
    fs.writeFile(variableFile, project.content, () => {
        sass.render({
            file: projectFile,
            outFile: outputFile,

            sourceMap: true
        }, (err, result) => {
            console.log(err);

            if (!err) {
                // No errors during the compilation, write this result on the disk
                console.log(result.css.toString());
                fs.writeFile(outputFile, result.css, () => {
                    res.redirect('/projects/' + project.$loki);
                });
            }
        });
    });

});

module.exports = router;
