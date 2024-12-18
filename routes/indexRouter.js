const express = require('express');
const router = express.Router();

const { isLoggedIn } = require("../middlewares/isLoggedIn");

const adminModel = require('../models/admin-model');
const postModel = require('../models/post-model');


router.get('/', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('index', { isLoggedIn });
})

router.get('/about', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('about', { isLoggedIn });
})

router.get('/payment/class', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('selectClassFees', { isLoggedIn });
})

router.get('/payment', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('paymentFees', { isLoggedIn });
})

router.get('/payment/class', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('selectClassFees', { isLoggedIn });
})

router.get('/payment/class/six', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('fees', { isLoggedIn });
})

router.get('/payment/class/seven', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('fees', { isLoggedIn });
})

router.get('/payment/class/eight', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('fees', { isLoggedIn });
})

router.get('/payment/class/nine', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('fees', { isLoggedIn });
})

router.get('/payment/class/ten', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('fees', { isLoggedIn });
})

router.get('/blog', isLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const posts = await postModel.getAllPosts();
  res.render('blog', { isLoggedIn, posts });
})

router.get('/blog/view/:id', isLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  try {
    const postDetails = await postModel.findOne({ _id: req.params.id });
    const admin = await adminModel.findOne();
    const adminName = admin.fullname;
    console.log(adminName)

    const dateTimestamp = postDetails.createdAt;
    const timestamp = new Date(dateTimestamp);
    const month = timestamp.toLocaleString('en-US', { month: 'long' });
    const day = String(timestamp.getDate()).padStart(2, '0');
    const year = timestamp.getFullYear();
    const customFormattedDate = `${month} ${day}, ${year}`;

    res.render('blogView', { isLoggedIn, postDetails, customFormattedDate, adminName });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/post/management');
  }
});

router.get('/exams', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('exam', { isLoggedIn });
})

router.get('/contact', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('contact', { isLoggedIn });
})

module.exports = router;