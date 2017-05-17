let router = require('express').Router()
let sass = require('node-sass')
let fs = require('fs')
let path = require('path')
let parseData = require('../modules/projects/parser')
let projectData = require('../modules/projects/project')
let uuid = require('uuid/v4')

router.get('/', (req, res) => {
  let projects = req.database.getCollection('projects')
  res.send(projects.data)
})

router.get('/my', (req, res) => {
  if(!req.user) {
    return res.status(403).send();
  }
  let projects = req.database.getCollection('projects')
  let myProjects = projects.find({ userId: req.user.uuid })
  res.send(myProjects)
})

router.post('/', (req, res) => {
  let projects = req.database.getCollection('projects')

  let userId = null
  if (req.user) {
    userId = req.user.uuid
  }

  if (req.body.name) {
    let project = projects.insert({
      uuid: uuid(),
      name: req.body.name,
      userId,
    })

    parseData.parseFile(project).then(varData => {
      res.send({
        project,
        varData,
      })
    })
  }
})

router.get('/:uuid', (req, res) => {
  let projects = req.database.getCollection('projects')
  let project = projects.findOne({ uuid: req.params.uuid })

  if (!project) {
    res.status(404).send()
  }

  parseData.parseFile(project).then(varData => {
    res.send({
      project,
      varData,
    })
  })
})

router.get('/:uuid/:page', (req, res) => {
  let projects = req.database.getCollection('projects')
  let project = projects.findOne({ uuid: req.params.uuid })
  if (!project) {
    return req.next()
  }

  let pagename = req.params.page.toLowerCase().replace(/[^a-z0-9]/g, '')
  let pageslug = 'projects/pages/home'
  try {
    let page = fs.lstatSync(req.viewsDir + '/projects/pages/' + pagename + '.hbs')
    if (page.isFile()) {
      pageslug = 'projects/pages/' + pagename
    }
  } catch (err) {
    return req.next()
  }

  res.render(pageslug, {
    layout: 'project',
    title: 'Projects',
    project: project,
    cssFile: projectData.getCss(req.publicDir, project)
  })
})

router.post('/:uuid/settings', (req, res) => {
  let projects = req.database.getCollection('projects')
  let project = projects.findOne({ uuid: req.params.uuid })
  if (!project) {
    res.status(404).send()
  }
  if (req.body.name) {
    project.name = req.body.name
  }
  if (req.body.settings instanceof Object) {
    let settings = {}
    for (let key in req.body.settings) {
      if (!req.body.settings.hasOwnProperty(key)) {
        continue
      }
      settings[key] = req.body.settings[key]
    }
    project.settings = settings
  }
  projects.update(project)
  res.send({
    message: 'success',
    project,
  })
})

router.post('/:uuid', (req, res) => {
  let projects = req.database.getCollection('projects')
  let project = projects.findOne({ uuid: req.params.uuid })

  if (!project) {
    res.status(404).send()
  }

  parseData.parseFile().then((varData) => {
    let changed = []
    for (varItem of varData) {
      let posted = req.body.data[varItem.name]
      if (posted) {
        changed.push(varItem.name + ': ' + posted)
      }
    }

    const content = project.content
    project.content = changed.join(';\n') + ';'
    projectData.render(req.dataDir, req.publicDir, project)
      .then(() => {
        projects.update(project)
        res.send({
          message: 'success',
          project,
        })
      })
      .catch(error => {
        project.content = content
        res.status(400).send({
          message: 'failed',
          error,
        })
      })
  })
})

module.exports = router
