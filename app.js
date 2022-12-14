// Server configuration

const express = require('express');
const app = express();
const path = require('path')
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const session = require('express-session');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
Handlebars.registerHelper('eq', function(a, b, options) {
  if (a == b) return options.fn(this)
  else return options.inverse(this)
});
Handlebars.registerHelper('neq', function(a, b, options) {
  if (a != b) return options.fn(this)
  else return options.inverse(this)
});
Handlebars.registerHelper('gt', function(a, b, options) {
  if (a > b) return options.fn(this)
  else return options.inverse(this)
});
Handlebars.registerHelper('ne', function(a, options) {
  if (!a) return options.fn(this)
  else return options.inverse(this)
});

app.use('/public', static);
app.use('/static', express.static('public'))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  helpers: {
    checkListLengthZero: function(arr){
      return arr.length == 0;
    }
  },
  partialsDir: ['views/partials/']
}));
app.set('view engine', 'handlebars');

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}));


// Middleware: Change Request Method
const methodsChangeMiddleware = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};
app.use(methodsChangeMiddleware);


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});