const express = require('express');
const errorHandler = express.Router();

errorHandler.use((req, res, next) => {
  const error = new Error('Page not found!');
  error.status = 404;
  next(error);
});

errorHandler.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';

  res.status(statusCode).render('errorHandler', {
    error: {
      message: isDev ? err.message : 'Something went wrong!',
      status: statusCode,
    },
  });
});

module.exports = errorHandler;