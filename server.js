var express = require('express');
var http = require('http');

var app = express();

app.use(express.static('./client'));


app.listen(process.env.PORT || 3000, function() {
  console.log('listening on port', process.env.PORT || 3000);
});


