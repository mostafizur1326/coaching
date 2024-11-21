require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const dbgr = require('debug')('development: app');
const PORT = process.env.PORT || 5000;

const connectDB = require('./config/mongoose-connection.js');

const indexRouter = require('./routes/indexRouter.js');
const userRouter = require('./routes/userRouter.js');
const studentRouter = require('./routes/studentRouter.js');
const adminRouter = require('./routes/adminRouter.js');

const errorHandler = require('./middlewares/errorHandler.js');
const isLoggedIn = require('./middlewares/isLoggedIn.js');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(isLoggedIn);
app.use(logger('dev'));

connectDB()
  .then(() => {
    
    
    app.use('/', indexRouter);
    app.use('/user', userRouter);
    app.use('/student', studentRouter);
    app.use('/admin', adminRouter);
    
    app.use(errorHandler);
    
    app.listen(PORT, () => {
      dbgr(`Server running on:${PORT}`);
    })
  })
  .catch((error) => {
    dbgr(`MongoDB database connection Failed: ${error}`);
  })