const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect('/user/login');
  else {
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    req.user = data;
  }
  next();
}

function adminIsLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect('/admin/bpmhs/author/login');
  else {
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    req.user = data;
  }
  next();
}

module.exports = {
  isLoggedIn,
  adminIsLoggedIn
};