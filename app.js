var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');
var minimist = require('minimist');
var handleAc = require('./controllers/handleAc');

var options = {
  key: fs.readFileSync('./certs/NWC.key.pem'),
  cert: fs.readFileSync('./certs/NWC.cert.pem'),
};

var app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ac', handleAc);

var server;
var port;
var args = minimist(process.argv.slice(2));

if (args.mode === 'https') {
  server = https.createServer(options, app);
  port = 443;
} else {
  server = http.createServer(app);
  port = 80;
}

server.listen(port, function() {
  console.log('Server is running on ' + args.mode.toUpperCase() + ' mode, port ' + port);
});
