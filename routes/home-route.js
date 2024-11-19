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
  res.render('admission');
})

router.get('/ar', (req, res) => {
  res.render('adminRegistration');
})

router.get('/al', (req, res) => {
  res.render('adminLogin');
})

router.get('/am', (req, res) => {
  res.render('admissionMessage');
})

router.get('/n', (req, res) => {
  res.render('notice');
})

router.get('/nv', (req, res) => {
  res.render('noticeView');
})

router.get('/ab', (req, res) => {
  res.render('about');
})

router.get('/ex', (req, res) => {
  res.render('exam');
})


module.exports = router;