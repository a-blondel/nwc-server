var net = require('net');
var http = require('http');
var querystring = require("querystring");
var handleAc = require('./controllers/handleAc');
var utils = require('./utils/utils');

var server = net.createServer(function(socket) {
  socket.on('data', function(data) {
    var response = new http.ServerResponse(socket);
    var request = new http.IncomingMessage(socket);

    request.headers = {};
    request.rawHeaders = [];

    response.socket = socket;

    var lines = data.toString().split('\r\n');

    var requestLine = lines[0].split(' ');
    if (requestLine.length < 3 || requestLine[2].indexOf('HTTP/') !== 0) {
        console.log('Received non-HTTP data:', data.toString());
        return;
    }
    request.method = requestLine[0];
    request.url = requestLine[1];
    request.httpVersion = requestLine[2].split('/')[1];

    var i = 1;
    while (lines[i] !== '') {
        var header = lines[i].split(': ');
        request.headers[header[0].toLowerCase()] = header[1];
        i++;
    }

    var body = lines.slice(i + 1).join('\r\n');
    if (body) {
        request.body = querystring.parse(body);
    }

    if (request.httpVersion) {
      var clientIp = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
      console.log('Request:\r\n', clientIp, request.method, request.url, request.httpVersion, '\r\n', request.headers, '\r\n', body);
      if (request.method === 'POST' && request.url === '/ac') {
        handleAc(request, response);
      } else {
        utils.sendHttpResponse(response, '404 Not Found', 'Not Found');
      }

    } else {
      socket.write('Hello, TCP client!\n');
    }
  });
});

server.listen(80);