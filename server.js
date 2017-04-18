//to view es6 capabilities see http://node.green/
//node v8-options es6 module syntax currently under development (2016/06/25)
let path         = require('path');
let express      = require('express');
let expressHbs   = require('express-handlebars');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let loki         = require('lokijs');
let fs           = require('fs');
let routes       = require('./routes');

//setup
let database = new loki('database.loki', {
    autoload: true,
    autosave: true,
});
if(!database.getCollection('projects')) {
    database.addCollection('projects');
}
let app      = express();

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

//view engine & main template
app.engine('.hbs', expressHbs({defaultLayout: 'template', extname: '.hbs'}));
app.set('view engine', '.hbs');

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/', express.static('public'));

//loki db reference for the router
app.use((req, res, next) => {
    req.database = database;
    next();
});

//loki db reference for the router
app.use((req, res, next) => {
    req.viewsDir = app.get('views');
    req.dataDir = __dirname + '/data';
    req.publicDir = __dirname + '/public/css/data';
    if (false === fs.existsSync(req.dataDir)) {
        fs.mkdir(req.dataDir);
    }
    next();
});

//router
routes.create(app);

//server
app.listen(app.get('port'), '0.0.0.0', () => console.log('Listening on http://0.0.0.0:' + app.get('port')));
