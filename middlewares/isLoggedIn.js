 const jwt = require('jsonwebtoken');
/*
function isLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect('/user/login');
  else {
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    req.user = data;
  }
  next();
}

function adminIsLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect('/admin/login');
  else {
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    req.user = data;
  }
  next();
}

module.exports = {
  isLoggedIn,
  adminIsLoggedIn
};*/


/*const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect("/user/login");
  try {
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    req.user = data; 
    next(); 
  } catch (err) {
    return res.status(401).redirect("/user/login");
  }
}

function adminIsLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect("/admin/login");
  try {
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    if (data.role !== "admin") {
      return res.status(403).redirect("/");
    }
    req.user = data;
    next(); 
  } catch (err) {
    return res.status(401).redirect("/admin/login");
  }
}

module.exports = {
  isLoggedIn,
  adminIsLoggedIn,
};*/

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect("/user/login");
  try {
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).redirect("/user/login"); // Ensure a correct redirect
  }
}

function adminIsLoggedIn(req, res, next) {
  if (!req.cookies.token) return res.redirect("/admin/login");
  try {
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    if (data.role !== "admin") {
      return res.status(403).redirect("/"); // Ensure you are redirecting to the homepage for non-admin
    }
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).redirect("/admin/login"); // Redirect to admin login on token failure
  }
}

module.exports = {
  isLoggedIn,
  adminIsLoggedIn
};