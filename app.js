var net = require("net");
var querystring = require("querystring");
var handleAc = require("./controllers/handleAc");
var utils = require("./utils/utils");

var server = net.createServer(function (socket) {
    var data = '';
    socket.on('data', function (chunk) {
        data += chunk;
        var separator = '\r\n\r\n';
        var endIndex = data.indexOf(separator);
        if (endIndex === -1) {
            // The entire header has not been received yet. Wait for more data.
            return;
        }
        var requestText = data.substring(0, endIndex);
        var remainingData = data.substring(endIndex + separator.length);
        var lines = requestText.split('\r\n');
        var headers = {};
        var body = '';
        var i = 0;
        while (i < lines.length && lines[i] !== '') {
            var header = lines[i].split(': ');
            headers[header[0].toLowerCase()] = header[1];
            i++;
        }
        if (headers['content-length']) {
            var expectedBodyLength = parseInt(headers['content-length'], 10);
            if (remainingData.length < expectedBodyLength) {
                // The entire body has not been received yet. Wait for more data.
                return;
            }
            var body = remainingData.substring(0, expectedBodyLength);
            data = remainingData.substring(expectedBodyLength);
        }

        var request = {
            method: lines[0].split(' ')[0].toUpperCase(),
            url: lines[0].split(' ')[1],
            httpVersion: lines[0].split(' ')[2],
            headers: headers,
            body: querystring.parse(body + data),
        };

        if (request.method && request.url) {
            console.log("--- Request from " + socket.remoteAddress + " ---\r\n", request, "\r\n\r\n");
            if (request.method === "POST" && request.url === "/ac") {
                handleAc(socket, request);
            } else {
                utils.sendHttpResponse(socket, "404 Not Found", "Not Found");
            }
        } else {
            socket.write("Hello, TCP client!\n");
        }
    });
});

server.listen(80);
