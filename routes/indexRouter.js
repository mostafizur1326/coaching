const express = require('express');
const router = express.Router();

const { isLoggedIn } = require("../middlewares/isLoggedIn");

router.get('/', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('index', { isLoggedIn });
})

router.get('/about', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('about', { isLoggedIn });
})

router.get('/payment/class', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('selectClassFees', { isLoggedIn });
})


router.get('/blog', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('blog', { isLoggedIn });
})

router.get('/blog/view', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('blogView', { isLoggedIn });
})

router.get('/exams', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('exam', { isLoggedIn });
})

router.get('/contact', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('contact', { isLoggedIn });
})

module.exports = router;