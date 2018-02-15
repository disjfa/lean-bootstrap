//to view es6 capabilities see http://node.green/
//node v8-options es6 module syntax currently under development (2016/06/25)
let path = require('path')
let express = require('express')
let expressHbs = require('express-handlebars')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let loki = require('lokijs')
let fs = require('fs')
let routes = require('./server/routes')
let passport = require('passport')
let uuid = require('uuid/v4')

//setup
let database = new loki('database.loki', {
  autoload: true,
  autosave: true,
})
if (!database.getCollection('projects')) {
  database.addCollection('projects')
}
if (!database.getCollection('users')) {
  database.addCollection('users')
}
let app = express()
//settings
app.set('port', process.env.PORT || 3000)
app.set('host', process.env.HOST || 'localhost')
app.set('env', process.env.NODE_ENV || 'development')
app.set('views', path.join(__dirname, 'server/views'))
app.set('dataDir', path.join(__dirname, 'data'))
app.set('publicDir', path.join(__dirname, 'public/css/data'))
let config
if (false !== fs.existsSync('./config.json')) {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
} else {
  config = {}
}
app.set('auth', config.auth || {});
app.set('database', database);

//view engine & main template
app.engine('.hbs', expressHbs({
  defaultLayout: 'template',
  extname: '.hbs',
  layoutsDir: 'server/views/layouts/',
  partialsDir: 'server/views/partials/',
}));
app.set('view engine', '.hbs');

const auth = app.get('auth');
const { github } = auth;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

if (github && github.clientID && github.clientSecret) {
  let GitHubStrategy = require('passport-github');
  passport.use(new GitHubStrategy({
      clientID: github.clientID,
      clientSecret: github.clientSecret,
      callbackURL: github.callbackURL,
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      let users = database.getCollection('users')
      let user = users.findOne({ githubId: profile.id }) || users.insert({
        uuid: uuid(),
        githubId: profile.id,
        displayName: profile.displayName,
        username: profile.username,
      });
      return done(null, user);
    },
  ));
}

//middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('express-session')({
  secret: '46a50826-3b44-11e7-a919-92ebcb67fe33',
  resave: true,
  saveUninitialized: true
}))
// use passport session
app.use(passport.initialize())
app.use(passport.session())
app.use('/', express.static('public'))

//loki db reference for the router
app.use((req, res, next) => {
  req.database = database
  next()
})

//loki db reference for the router
app.use((req, res, next) => {
  req.viewsDir = app.get('views')
  req.dataDir = app.get('dataDir')
  req.publicDir = app.get('publicDir')
  if (false === fs.existsSync(req.dataDir)) {
    fs.mkdir(req.dataDir)
  }
  next()
})

//router
routes.create(app)

//server
app.listen(app.get('port'), app.get('host'), () => console.log('Listening on http://' + app.get('host') + ':' + app.get('port')))
