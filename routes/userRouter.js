const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

const dbgr = require('debug')('development: app');

const { verificationEmail, OTP } = require("../controllers/email-verification.js");

const sendedOTP = OTP;

router.get('/register', (req, res) => {
  res.render('registration');
});

router.post('/register', async (req, res) => {
  const { email } = req.body;
  try {
    await verificationEmail(email);
    dbgr("Email sent successfully!");
  } catch (error) {
    dbgr("Error sending email:", error);
  }
  res.status(200).redirect('/user/verify');
});

router.get('/verify', (req, res) => {
  res.render('verification');
});

router.get('/verify/failed', (req, res) => {
  res.render('verificationFailed');
});


router.post('/verify', (req, res) => {
  const { digit1, digit2, digit3, digit4, digit5, digit6 } = req.body;
  
  const enteredOTP = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
  
  if (sendedOTP !== enteredOTP) {
    res.status(500).render('verificationFailed',{ errorMessage: "The verification code you entered is incorrect. Please try again."});
  } else {
    console.log(sendedOTP)
    res.status(200).redirect('/user/login');
    
  }
});


router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;