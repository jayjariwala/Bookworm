var express=require('express');
var app = express();
var bodyParser= require('body-parser');
var bookController = require('./bookController/bookController');
var session=require('express-session');

app.set('view engine','ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:'true'}));
app.use(bodyParser.json());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla'
}));

bookController(app);


var port = process.env.PORT || 8084
app.listen(port);
