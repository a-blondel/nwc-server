const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const constants = require('constants');

const options = {
  key: fs.readFileSync('./certs/NWC.key.pem'),
  cert: fs.readFileSync('./certs/server-chain.pem'),
  secureProtocol: 'SSLv23_method',
  secureOptions: constants.SSL_OP_NO_TLSv1_1 | constants.SSL_OP_NO_TLSv1_2 | constants.SSL_OP_NO_TLSv1_3,
  ciphers: 'RSA_WITH_RC4_128_MD5'
};

const app = express();

const handleAc = require('./controllers/handleAc');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ac', handleAc);

const server = https.createServer(options, app);

server.listen(443, function() {
  console.log('Server is running on port ' + 443);
});