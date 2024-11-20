const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
})

router.get('/about', (req, res) => {
  res.render('about');
})

router.get('/notice', (req, res) => {
  res.render('notice');
})

router.get('/notice/view', (req, res) => {
  res.render('noticeView');
})

router.get('/exam', (req, res) => {
  res.render('exam');
})

router.get('/contact', (req, res) => {
  res.render('contact');
})

module.exports = router;