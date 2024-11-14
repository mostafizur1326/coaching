require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;

const connectDB = require('./config/mongoose-connection.js');

const homeRouter = require('./routes/home-route.js');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));


connectDB()
  .then(() => {
    
    app.use('/', homeRouter);
    
    
    app.listen(PORT, () => {
      console.log(`Server running on https://localhost:${PORT}`);
    })
  })
  .catch((error) => {
    console.log(`MongoDB database connection Failed: ${error}`);
  })