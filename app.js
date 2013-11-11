//loads express
global.config = require('./config');

var express = require('express');

//These 2 are just for the user creation
var fs = require('fs');

var app = express();
app.use(express.bodyParser());

var mcorRest = require('mcor-rest');

//Enables loads static files like css, and js
app.use(express.static(__dirname + '/public'));

//catchall for the api
app.all('/api/:action/:table', function(req,res, next){
	mcorRest.request(req,res, function(){});		
});


app.listen(2102);
