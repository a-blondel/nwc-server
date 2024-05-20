const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const fs = require('fs');
const minimist = require('minimist');

const options = {
  key: fs.readFileSync('./certs/NWC.key.pem'),
  cert: fs.readFileSync('./certs/NWC.cert.pem'),
};

const app = express();

const handleAc = require('./controllers/handleAc');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ac', handleAc);

let server;
let port;
const args = minimist(process.argv.slice(2));

if (args.mode === 'https') {
  server = https.createServer(options, app);
  port = 443;
} else {
  server = http.createServer(app);
  port = 80;
}

server.listen(port, () => {
  console.log(`Server is running on ${args.mode.toUpperCase()} mode, port ${port}`);
});