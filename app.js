require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

const options = {
  key: fs.readFileSync('./certs/NWC.key.pem'),
  cert: fs.readFileSync('./certs/NWC.cert.pem'),
  secureOptions: crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1,
  ciphers: 'SHA1'
};

const app = express();

const handleAc = require('./controllers/handleAc');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ac', handleAc);

const server = https.createServer(options, app);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});