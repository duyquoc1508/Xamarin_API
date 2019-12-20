require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const port = process.env.PORT || 3000;
const secret = process.env.SECRET || 'p76t8$-H/EC8*Gj#';
const database = require('./database');
const api = require('./api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(database.name, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to database'))
  .catch(error => console.log(error));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'))

/**
 * middleware run first
 */
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization, secret, (err, decoded) => {
      if (err) req.user = undefined;
      req.user = decoded;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

app.use('/api', api);

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found.' })
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});