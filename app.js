'use strict';
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let nunjucks = require('nunjucks');
let session = require('express-session');
let cors = require('cors');
let index = require('./routes/index');
let users = require('./routes/users');
let login = require('./routes/login');
let register = require('./routes/register');
let app = express();
let db = require('./sequelize');
db.sequelize.sync();
//console.log(JSON.stringify(JSON.parse(db),2,2));

app.use(session({
    secret: 'qwertyuiop',
    resave: false,
    saveUninitialized : false
}));
let env = nunjucks.configure('views',{
    autoescape: true,
    express: app
});
require('./libs/pagination')(env);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/register',register);
app.use('/login', login);
//check session
app.use(function (req,res,next) {
    if (req.session.user){
        res.locals.user = req.session.user;
        next();
    }else{
        res.redirect('/login');
    }
});

app.use('/', index);
app.use('/user', users);

app.use('/logout', function(req, res) {
    req.session.user = null;
    res.render('login', { title: 'Login Page' });
});
app.use(function (req,res) {
    res.render('error',{
        message: 'Page not found !'
    });
})

module.exports = app;
