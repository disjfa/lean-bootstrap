const router = require('express').Router();
const fs = require('fs');
const parseData = require('../modules/projects/parser');
const projectData = require('../modules/projects/project');
const uuid = require('uuid/v4');

router.get('/', (req, res) => {
  const projects = req.database.getCollection('projects');
  res.send(projects.data);
});

router.get('/my', (req, res) => {
  if (!req.user) {
    return res.status(403).send({ data: {}, statusText: 'not allowed', code: 403 });
  }
  const projects = req.database.getCollection('projects');
  const myProjects = projects.find({ userId: req.user.uuid });
  res.send(myProjects);
});

router.post('/', (req, res) => {
  const projects = req.database.getCollection('projects');

  let userId = null;
  if (req.user) {
    userId = req.user.uuid;
  }

  if (req.body.name) {
    const project = projects.insert({
      uuid: uuid(),
      name: req.body.name,
      userId,
    });

    parseData.parseFile(project).then((varData) => {
      const content = [];

      for (varItem of varData) {
        content.push(`${varItem.name}: ${varItem.value}`);
        switch (varItem.name) {
          case '$black':
            content.push(`$grays: (
  100: $gray-100,
  200: $gray-200,
  300: $gray-300,
  400: $gray-400,
  500: $gray-500,
  600: $gray-600,
  700: $gray-700,
  800: $gray-800,
  900: $gray-900
)`);
            break;
          case '$dark':
            content.push(`$colors: (
  blue: $blue,
  indigo: $indigo,
  purple: $purple,
  pink: $pink,
  red: $red,
  orange: $orange,
  yellow: $yellow,
  green: $green,
  teal: $teal,
  cyan: $cyan,
  white: $white,
  gray: $gray-600,
  gray-dark: $gray-800
)`);
            content.push(`$theme-colors: (
  primary: $primary,
  secondary: $secondary,
  success: $success,
  info: $info,
  warning: $warning,
  danger: $danger,
  light: $light,
  dark: $dark
)`);
            content.push(`$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
)`);
            break;
        }
      }
      project.content = `${content.join(';\n')};`;
      projectData.render(req.dataDir, req.publicDir, project)
        .then(() => {
          res.send({
            project,
            varData,
          });
        });
    });
  }
});

router.get('/:uuid', (req, res) => {
  const projects = req.database.getCollection('projects');
  const project = projects.findOne({ uuid: req.params.uuid });
  const { user } = req;
  const userId = user ? user.uuid : null;

  if (!project) {
    res.status(404).send();
  }

  let canEdit = true;
  if (project.userId && userId !== project.userId) {
    canEdit = false;
  }

  parseData.parseFile(project).then((varData) => {
    res.send({
      canEdit,
      project,
      varData,
    });
  });
});

router.get('/:uuid/:page', (req, res) => {
  const projects = req.database.getCollection('projects');
  const project = projects.findOne({ uuid: req.params.uuid });
  if (!project) {
    return req.next();
  }

  const pagename = req.params.page.toLowerCase().replace(/[^a-z0-9]/g, '');
  let pageslug = 'projects/pages/home';
  try {
    const page = fs.lstatSync(`${req.viewsDir}/projects/pages/${pagename}.hbs`);
    if (page.isFile()) {
      pageslug = `projects/pages/${pagename}`;
    }
  } catch (err) {
    return req.next();
  }

  res.render(pageslug, {
    layout: 'project',
    title: 'Bootstrap playground',
    url: req.protocol + '://' + req.hostname + req.originalUrl,
    editUrl: '/#' + req.originalUrl,
    image: req.protocol + '://' + req.hostname + '/icons/favicon-230x230.png',
    project,
    cssFile: projectData.getCss(req.publicDir, project),
  });
});

router.post('/:uuid/settings', (req, res) => {
  const projects = req.database.getCollection('projects');
  const project = projects.findOne({ uuid: req.params.uuid });
  const { user } = req;
  const userId = user ? user.uuid : null;

  if (!project) {
    res.status(404).send();
  }

  if (project.userId && userId !== project.userId) {
    return res.status(403).send();
  }

  if (req.body.name) {
    project.name = req.body.name;
  }

  if (req.body.settings instanceof Object) {
    const settings = {};
    for (const key in req.body.settings) {
      if (!req.body.settings.hasOwnProperty(key)) {
        continue;
      }
      settings[key] = req.body.settings[key];
    }
    project.settings = settings;
  }
  projects.update(project);
  res.send({
    message: 'success',
    project,
  });
});

router.post('/:uuid', (req, res) => {
  const projects = req.database.getCollection('projects');
  const project = projects.findOne({ uuid: req.params.uuid });
  const { user } = req;
  const userId = user ? user.uuid : null;

  if (!project) {
    return res.status(404).send();
  }

  if (project.userId && userId !== project.userId) {
    return res.status(403).send();
  }

  parseData.parseFile().then((varData) => {
    const changed = [];
    for (varItem of varData) {
      const posted = req.body.data[varItem.name];
      if (posted) {
        changed.push(`${varItem.name}: ${posted}`);
        switch (varItem.name) {
          case '$black':
            changed.push(`$grays: (
  100: $gray-100,
  200: $gray-200,
  300: $gray-300,
  400: $gray-400,
  500: $gray-500,
  600: $gray-600,
  700: $gray-700,
  800: $gray-800,
  900: $gray-900
)`);
            break;
          case '$dark':
            changed.push(`$colors: (
  blue: $blue,
  indigo: $indigo,
  purple: $purple,
  pink: $pink,
  red: $red,
  orange: $orange,
  yellow: $yellow,
  green: $green,
  teal: $teal,
  cyan: $cyan,
  white: $white,
  gray: $gray-600,
  gray-dark: $gray-800
)`);
            changed.push(`$theme-colors: (
  primary: $primary,
  secondary: $secondary,
  success: $success,
  info: $info,
  warning: $warning,
  danger: $danger,
  light: $light,
  dark: $dark
)`);
            changed.push(`$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
)`);
            break;
        }
      }
    }

    const content = project.content;
    project.content = `${changed.join(';\n')};`;
    projectData.render(req.dataDir, req.publicDir, project)
      .then(() => {
        projects.update(project);
        res.send({
          message: 'success',
          project,
        });
      })
      .catch((error) => {
        project.content = content;
        res.status(400).send({
          message: 'Error, could not build from these variables. Try resetting some or reload page.',
          error,
        });
      });
  });
});

module.exports = router;
