const express  = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { LIMIT } = require('./constants.js');

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credential: true
}));

app.use(express.json({ limit: LIMIT }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, limit: LIMIT }));



module.exports = app;