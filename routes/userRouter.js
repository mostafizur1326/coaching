const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const dbgr = require('debug')('development: app');

const userModel = require("../models/user-model");

const { verificationEmail, OTP } = require("../controllers/email-verification.js");

const isLoggedIn = require("../middlewares/isLoggedIn");

const sendedOTP = OTP;

router.get('/register', (req, res) => {
  res.render('registration');
});

router.post('/register', async (req, res) => {
  const { fullname, email, number, password, confirmpassword, condition } = req.body;

  if (password !== confirmpassword) {
    return res.status(400).render('registration', {
      fullname,
      email,
      number,
      password,
      confirmpassword,
      condition,
    });
  }

  try {
    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userModel.create({
      fullname,
      email,
      number,
      password: hashedPassword,
      confirmpassword: hashedPassword,
      condition,
    });

    await newUser.save();

    try {
      await verificationEmail(email);
      return res.status(201)
      dbgr("User account created successfully. Verification email sent.");
    } catch (emailError) {
      return res.status(500)
      dbgr("Error sending verification email.");
    }
  } catch (err) {
    return res.status(500)
    dbgr(err.message);
  }
});

module.exports = router;
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
    res.status(500).render('verificationFailed', { errorMessage: "The verification code you entered is incorrect. Please try again." });
  } else {
    res.status(200).redirect('/user/login');
  }
});


router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/logout', (req, res) => {

  console.log(token)
  res.status(200).redirect('/');
});

module.exports = router;