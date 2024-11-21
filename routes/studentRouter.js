const express = require('express');
const router = express.Router();

router.get('/result', (req, res) => {
  res.render('resultForm');
})

router.get('/class', (req, res) => {
  res.render('selectClass');
})

router.get('/class/six', (req, res) => {
  res.render('resultForm');
})

router.get('/class/seven', (req, res) => {
  res.render('resultForm');
})

router.get('/class/eight', (req, res) => {
  res.render('resultForm');
})

router.get('/class/nine', (req, res) => {
  res.render('resultForm');
})

router.get('/class/ten', (req, res) => {
  res.render('resultForm');
})

router.get('/payment', (req, res) => {
  res.render('paymentFees');
})

router.get('/fees/class', (req, res) => {
  res.render('selectClassFees');
})

router.get('/fees/class/six/fees', (req, res) => {
  res.render('schoolFees');
})

router.get('/fees/class/seven/fees', (req, res) => {
  res.render('schoolFees');
})

router.get('/fees/class/eight/fees', (req, res) => {
  res.render('schoolFees');
})

router.get('/fees/class/nine/fees', (req, res) => {
  res.render('schoolFees');
})

router.get('/fees/class/ten/fees', (req, res) => {
  res.render('schoolFees');
})

router.get('/admission', (req, res) => {
  res.render('admission');
})

router.post('/admission/confirmation/successful', (req, res) => {
  console.log(req.body)
  res.render('admissionMessage');
})

router.get('/settings', (req, res) => {
  res.render('settings');
})

router.get('/profile', (req, res) => {
  res.render('profile');
})

module.exports = router;