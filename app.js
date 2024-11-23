require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const dbgr = require('debug')('app: app');
const PORT = process.env.PORT || 5000;

const connectDB = require('./config/mongoose-connection.js');

const indexRouter = require('./routes/indexRouter.js');
const userRouter = require('./routes/userRouter.js');
const studentRouter = require('./routes/studentRouter.js');
const adminRouter = require('./routes/adminRouter.js');

const errorHandler = require('./middlewares/errorHandler.js');

app.use(session({
  secret: process.env.JWT_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

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