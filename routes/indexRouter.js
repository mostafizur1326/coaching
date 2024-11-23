const express = require('express');
const router = express.Router();

const isLoggedIn = require("../middlewares/isLoggedIn");

router.get('/', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('index', { isLoggedIn });
})

router.get('/about', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('about', { isLoggedIn });
})

router.get('/notice', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('notice', { isLoggedIn });
})

router.get('/notice/view', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('noticeView', { isLoggedIn });
})

router.get('/exam', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('exam', { isLoggedIn });
})

router.get('/contact', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('contact', { isLoggedIn });
})

module.exports = router;