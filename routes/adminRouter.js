const express = require('express');
const router = express.Router();
//const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const dbgr = require('debug')('app: app');

const adminModel = require('../models/admin-model');

//const { verificationEmail, OTP } = require('../controllers/email-welcome');

const { adminIsLoggedIn } = require("../middlewares/isLoggedIn");


router.get('/registration', (req, res) => {
  res.render('adminRegistration');
})

router.post('/registration', async (req, res) => {
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
      const token = jwt.sign({ email, adminId: admin._id },
        process.env.JWT_SECRET_KEY, { expiresIn: '6h' }
      );
      res.cookie('token', token);

      req.flash('success', 'Admin account created successfully! Please login.');
      return res.status(200).redirect('/admin/login');
    }
  } catch (error) {
    return res.status(500).render("adminRegistrationError", { message: "An unexpected error occurred. Please try again later." });
  }
});

router.get('/login', (req, res) => {
  res.render('adminLogin');
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.redirect('/admin/registration');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const token = jwt.sign({ email, adminId: admin._id, role: admin.role }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });

      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return res.redirect('/admin/dashboard');
    } else {
      return res.render('adminLoginError', { message: 'Invalid email or password!' });
    }
  } catch (error) {
    res.status(500).render('adminLoginError', { message: 'Something went wrong!' });
  }
});

router.get('/dashboard', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('dashboard', { isLoggedIn });
})

router.get('/all/students', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('allStudents', { isLoggedIn });
})

router.get('/all/teachers', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('allTeachers', { isLoggedIn });
})

router.get('/post/management', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('postManagement', { isLoggedIn });
})

router.get('/result/management', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultManagement', { isLoggedIn });
})

router.get('/fees/management', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('feesManagement', { isLoggedIn });
})

router.get('/logout', (req, res) => {
  res.cookie('token', '');
  res.redirect('/admin/login');
});

module.exports = router;