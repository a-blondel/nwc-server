const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const handleAc = require('./controllers/handleAc');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/ac', handleAc);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});