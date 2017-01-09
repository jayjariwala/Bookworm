var express=require('express');
var app = express();
var bookController = require('./bookController/bookController');

bookController(app);

app.set('view engine','ejs');
app.use(express.static('public'))

var port= Number(8080 || process.env.port);
app.listen(port);
