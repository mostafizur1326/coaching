require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/db/db.js');
const { LIMIT } = require('./src/constants.js');
const PORT = process.env.PORT || 5000;

const homeRouter = require('./src/routes/home.js');
const aboutRouter = require('./src/routes/about.js');


app.set('view engine', 'ejs');
app.use(express.json({ LIMIT }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true,  LIMIT }));
app.use(cookieParser());
app.use(logger('dev'));


connectDB()
  .then(() => {
    
    app.use(homeRouter);
    app.use(aboutRouter);
    
    
    app.listen(PORT, () => {
      console.log(`Server running on https://localhost:${PORT}`);
    })
  })
  .catch((error) => {
    console.log(`MongoDB database connection Failed: ${error}`);
  })