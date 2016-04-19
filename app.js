"use strict";

var express = require('express');
var app = express();
var Route = require('./route.js');

require('dotenv').config({ silent: true });

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  console.log("Missing .env config file");
  process.exit(1);
}

app.get('/', function (req, res) {  
  var start = req.query.start;
  var stop = req.query.stop;
  var route = new Route(start, stop);
  route.getRoute().then(function(data) {
    res.send(data);
  });
  
});

let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`*** WebService started at ${port}`);
});
