const express = require('express');
const router = express.Router();
//const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const dbgr = require('debug')('app: app');

const adminModel = require('../models/admin-model');

//const { verificationEmail, OTP } = require('../controllers/email-welcome');

const { adminIsLoggedIn } = require("../middlewares/isLoggedIn");


router.get('/bpmhs/author/registration', (req, res) => {
  res.render('adminRegistration');
})

router.post('/bpmhs/author/registration', async (req, res) => {
  const { fullname, username, email, password, condition } = req.body;
  try {
    const adminCount = await adminModel.countDocuments();

    if (adminCount >= 1) {
      return res.status(201).redirect("/");
    } else {
      const salt = await bcrypt.genSalt(13);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newadmin = await adminModel.create({
        fullname,
        username,
        email,
        password: hashedPassword,
        condition
      });

      const admin = await adminModel.findOne({ email });
      const token = jwt.sign(
        { email, adminId: admin._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '6h' }
      );
      res.cookie('token', token);

      req.flash('success', 'Admin account created successfully! Please login.');
      return res.status(200).redirect('/admin/bpmhs/author/login');
    }
  } catch (error) {
    return res.status(500).render("adminRegistrationError", { message: "An unexpected error occurred. Please try again later." });
  }
});

router.get('/bpmhs/author/login', (req, res) => {
  res.render('adminLogin');
})

router.post('/bpmhs/author/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.redirect('/user/register');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const token = jwt.sign({ email, adminId: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });
      
      res.cookie('token', token);
      return res.redirect('/admin/bpmhs/author/home');
    } else {
      return res.render('adminLoginError', { message: 'Invalid email or password!' });
    }
  } catch (error) {
    res.status(500).render('loginError',{ message: 'Something went wrong!' });
  }
});

router.get('/logout', (req, res) => {
  res.cookie('token', '');
  res.redirect('/admin/bpmhs/author/login');
});


router.get('/bpmhs/author/home', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('index', { isLoggedIn });
})

router.get('/bpmhs/author/about', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('about', { isLoggedIn });
})

/*router.get('/bpmhs/author/notice', (req, res) => {
  res.render('notice');
})

router.get('/bpmhs/author/exam', (req, res) => {
  res.render('exam');
})

router.get('/bpmhs/author/contact', (req, res) => {
  res.render('contact');
})
*/

router.get('/logout', (req, res) => {
  res.cookie('token', '');
  res.redirect('/admin/bpmhs/author//login');
});

module.exports = router;