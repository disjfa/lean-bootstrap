let fs   = require('fs');
let sass = require('node-sass');

function getProjectDir(dataDir, project) {
    if (false === fs.existsSync(dataDir)) {
        fs.mkdir(dataDir);
    }
    let projectDir = dataDir + '/' + project.uuid;
    if (false === fs.existsSync(projectDir)) {
        fs.mkdir(projectDir);
    }
    return projectDir;
}

function getCssFile(dataDir, project) {
    let projectDir = getProjectDir(dataDir, project);

    let cssDir = projectDir + '/css';
    if (false === fs.existsSync(cssDir)) {
        fs.mkdir(cssDir);
    }

    return cssDir + '/project.css';
}

function getVariableFile(dataDir, project) {
    let projectDir = getProjectDir(dataDir, project);

    let scssDir = projectDir + '/scss';
    if (false === fs.existsSync(scssDir)) {
        fs.mkdir(scssDir);
    }

    return scssDir + '/_variables.scss';
}

function getProjectFile(dataDir, project) {
    let projectDir = getProjectDir(dataDir, project);

    let scssDir = projectDir + '/scss';
    if (false === fs.existsSync(scssDir)) {
        fs.mkdir(scssDir);
    }

    return scssDir + '/project.scss';
}

exports.getCss = (dataDir, project) => {
    let cssFile = getCssFile(dataDir, project);
    if (fs.existsSync(cssFile)) {
        return '/css/data' + cssFile.replace(dataDir, '');
    }
    return false;
};

exports.render = (dataDir, publicDataDir, project) => {
    let projectFile  = getProjectFile(dataDir, project);
    let variableFile = getVariableFile(dataDir, project);
    let outputFile   = getCssFile(publicDataDir, project);

    if(false === fs.existsSync(projectFile)) {
        fs.createReadStream(dataDir + '/base/project.scss').pipe(fs.createWriteStream(projectFile));
    }

    return new Promise((resolve, reject) => {
        fs.writeFile(variableFile, project.content, () => {
            sass.render({
                file: projectFile,
                outFile: outputFile,

                sourceMap: true
            }, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                // No errors during the compilation, write this result on the disk
                fs.writeFile(outputFile, result.css, () => {
                    resolve('saved');
                });

            });
        });
    });
};