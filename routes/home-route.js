const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
})

router.get('/l', (req, res) => {
  res.render('login');
})

router.get('/r', (req, res) => {
  res.render('registration');
})

router.get('/c', (req, res) => {
  res.render('contact');
})

router.get('/re', (req, res) => {
  res.render('result');
})

router.get('/a', (req, res) => {
  res.render('addmition');
})

router.get('/ar', (req, res) => {
  res.render('adminRegistration');
})

router.get('/al', (req, res) => {
  res.render('adminLogin');
})

router.get('/am', (req, res) => {
  res.render('addmitionMessage');
})

router.get('/n', (req, res) => {
  res.render('notice');
})

router.get('/nv', (req, res) => {
  res.render('noticeView');
})


module.exports = router;