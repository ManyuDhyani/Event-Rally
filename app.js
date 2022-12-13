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

app.use('/public', static);
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

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});