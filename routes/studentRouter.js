const express = require('express');
const router = express.Router();

router.get('/result', (req, res) => {
  res.render('resultForm');
})

router.get('/class', (req, res) => {
  res.render('selectClass');
})

router.get('/payment', (req, res) => {
  res.render('paymentFees');
})

router.get('/admission', (req, res) => {
  res.render('admission');
})

router.get('/admission/confirmation/successful', (req, res) => {
  res.render('admissionMessage');
})

router.get('/settings', (req, res) => {
  res.render('settings');
})

router.get('/profile', (req, res) => {
  res.render('profile');
})

module.exports = router;