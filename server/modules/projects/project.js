const fs = require('fs');
const sass = require('node-sass');

function getProjectDir(dataDir, project) {
  if (fs.existsSync(dataDir) === false) {
    fs.mkdir(dataDir);
  }
  const projectDir = `${dataDir}/${project.uuid}`;
  if (fs.existsSync(projectDir) === false) {
    fs.mkdir(projectDir);
  }
  return projectDir;
}

function getCssFile(dataDir, project) {
  const projectDir = getProjectDir(dataDir, project);

  const cssDir = `${projectDir}/css`;
  if (fs.existsSync(cssDir) === false) {
    fs.mkdir(cssDir);
  }

  return `${cssDir}/project.css`;
}

function getVariableFile(dataDir, project) {
  const projectDir = getProjectDir(dataDir, project);

  const scssDir = `${projectDir}/scss`;
  if (fs.existsSync(scssDir) === false) {
    fs.mkdir(scssDir);
  }

  return `${scssDir}/_variables.scss`;
}

function getProjectFile(dataDir, project) {
  const projectDir = getProjectDir(dataDir, project);

  const scssDir = `${projectDir}/scss`;
  if (fs.existsSync(scssDir) === false) {
    fs.mkdir(scssDir);
  }

  return `${scssDir}/project.scss`;
}

exports.getCss = (dataDir, project) => {
  const cssFile = getCssFile(dataDir, project);
  if (fs.existsSync(cssFile)) {
    return `/css/data${cssFile.replace(dataDir, '')}`;
  }
  return false;
};

exports.render = (dataDir, publicDataDir, project) => {
  const projectFile = getProjectFile(dataDir, project);
  const variableFile = getVariableFile(dataDir, project);
  const outputFile = getCssFile(publicDataDir, project);

  if (fs.existsSync(projectFile) === false) {
    fs.createReadStream(`${dataDir}/base/project.scss`).pipe(fs.createWriteStream(projectFile));
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(variableFile, project.content, () => {
      sass.render({
        file: projectFile,
        outFile: outputFile,

        sourceMap: true,
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
