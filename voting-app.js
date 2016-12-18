var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
//var mongoose = require('mongoose');

var port=process.env.PORT||8080;
var link="https://voting-app-fcc-thangbk2209.c9users.io/";
var mongoURL = 'mongodb://thangbk2209:thang2209@ds059516.mlab.com:59516/url-fcc-thangbk2209';
var mongo=require("mongodb").MongoClient;
var routes = require('./routes/index');
var users = require('./routes/user');
var app=express();

// View Engine
// app.use(express.static(path.join(__dirname, 'public')));
// app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'ejs');
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static(path.join(__dirname,"views")));
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

routes(app);
users(app,passport);
//app.use('/', routes);
app.use('/users', users);

app.listen(port,function(){
    console.log("listening on port: "+port);
})