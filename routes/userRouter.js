const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dbgr = require('debug')('app: app');

const userModel = require('../models/user-model');

const { verificationEmail, OTP } = require('../controllers/email-verification');

const isLoggedIn = require("../middlewares/isLoggedIn");

const sendedOTP = OTP;

router.get('/register', (req, res) => {
  res.render('registration');
});

router.post('/register', async (req, res) => {
  const { fullname, username, email, number, password, confirmpassword, condition } = req.body;

  if (!fullname || !username || !email || !number || !password || !confirmpassword || !condition) {
    return res.status(400).render("registrationError", { message: "All fields are required." });
  }

  if (password !== confirmpassword) {
    return res.status(400).render("registrationError", { message: "Passwords do not match." });
  }

  try {
    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).render("registrationError", { message: "Email or username already exists." });
    }

    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      fullname,
      username,
      email,
      number,
      password: hashedPassword,
      condition,
      isVerified: false
    });
    
    const user = userModel.findOne({ email });
    const token = jwt.sign(
      { email, userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '6h' });
    res.cookie('token', token);

    await verificationEmail(email);

    return res.status(201).redirect("/user/verify");
  } catch (error) {
    dbgr("Error creating user:", error);
    return res.status(500).render("registrationError", { message: "An unexpected error occurred. Please try again later." });
  }
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
    res.status(500).render('verificationFailed', { errorMessage: "The verification code you entered is incorrect. Please try again." });
  } else {
    res.status(200).redirect('/user/login');
  }
});

router.get('/error', (req, res) => {
  res.render('errorHandler');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    console.log(user);

    if (!user) {
      return res.redirect('/user/register');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log('Login successful');
      const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });
      
      res.cookie('token', token);
      return res.redirect('/');
    } else {
      console.log('Invalid credentials');
      return res.render('loginError', { message: 'Invalid email or password!' });
    }
  } catch (error) {
    dbgr('Error during login:', error);
    res.status(500).render({ message: 'Something went wrong!' });
  }
});

router.get('/logout', (req, res) => {
  res.cookie('token', '');
  res.redirect('/user/login');
});

module.exports = router;