const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect('/user/login');
  else {
    const data = jwt.verify(req.cookies.token, "1315192016920mOsTaFiZuRcCODE");
    req.user = data;
  }
  next();
}

module.exports = isLoggedIn;