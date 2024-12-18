const express = require('express');
const router = express.Router();
//const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const dbgr = require('debug')('app: app');

const adminModel = require('../models/admin-model');
const postModel = require('../models/post-model');

//const { verificationEmail, OTP } = require('../controllers/email-welcome');

const { adminIsLoggedIn } = require("../middlewares/isLoggedIn");

const upload = require("../utils/upload");

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

router.get('/post/management', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const posts = await postModel.getAllPosts();
  res.render('postManagement', { isLoggedIn, posts });
})

router.post('/post/management/create', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;

  upload.single('post_image')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.flash('error', 'File size should not exceed 5MB.');
      } else {
        req.flash('error', 'File upload failed. Please try again.');
      }
      return res.redirect('/admin/post/management');
    }

    try {
      const { post_title, post_description } = req.body;

      if (!req.file || !post_title || !post_description) {
        req.flash('error', 'All fields are required!');
        return res.redirect('/admin/post/management');
      }

      const newPost = await postModel.create({
        post_image: `/temp/post/${req.file.filename}`,
        post_title,
        post_description,
      });

      req.flash('success', 'Post created successfully!');
      res.redirect('/admin/post/management');
    } catch (error) {
      req.flash('error', 'Post creation failed!');
      res.redirect('/admin/post/management');
    }
  });
});

router.get('/post/view/:id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  try {
    const postDetails = await postModel.findOne({ _id: req.params.id });
    const admin = await adminModel.findOne();
    const adminName = admin.fullname;

    const dateTimestamp = postDetails.createdAt;
    const timestamp = new Date(dateTimestamp);
    const month = timestamp.toLocaleString('en-US', { month: 'long' });
    const day = String(timestamp.getDate()).padStart(2, '0');
    const year = timestamp.getFullYear();
    const customFormattedDate = `${month} ${day}, ${year}`;

    res.render('adminPostView', { isLoggedIn, postDetails, customFormattedDate, adminName });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/post/management');
  }
});

router.get('/post/delete/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const postDetails = await postModel.findOneAndDelete({ _id: req.params.id });
    req.flash('success', `Post with ID: ${req.params.id} has been deleted successfully.`);
    res.redirect('/admin/post/management')
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/post/management');
  }
});

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