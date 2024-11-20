const express = require('express');
const router = express.Router();

router.get('/bpmhs/author/registration', (req, res) => {
  res.render('adminRegistration');
})

router.get('/bpmhs/author/login', (req, res) => {
  res.render('adminLogin');
})

router.get('/bpmhs/author/home', (req, res) => {
  res.render('index');
})

router.get('/bpmhs/author/about', (req, res) => {
  res.render('about');
})

router.get('/bpmhs/author/notice', (req, res) => {
  res.render('notice');
})

router.get('/bpmhs/author/exam', (req, res) => {
  res.render('exam');
})

router.get('/bpmhs/author/contact', (req, res) => {
  res.render('contact');
})

module.exports = router;