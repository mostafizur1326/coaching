const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token || null;
  res.locals.isLoggedIn = !!token;
  next();
};

module.exports = isLoggedIn;