const express = require('express');
const router = express.Router();

const { isLoggedIn } = require("../middlewares/isLoggedIn");

const adminModel = require('../models/admin-model');
const postModel = require('../models/post-model');
const sixTHStudentModel = require('../models/class-six-student-model');
const sevenTHStudentModel = require('../models/class-seven-student-model');
const eightTHStudentModel = require('../models/class-eight-student-model');
const nineTHStudentModel = require('../models/class-nine-student-model');
const tenTHStudentModel = require('../models/class-ten-student-model');

const dbgr = require('debug')('app: app');


router.get('/', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('index', { isLoggedIn });
})

router.get('/about', (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('about', { isLoggedIn });
})

router.get('/payment/class', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('selectClassFees', { isLoggedIn });
})

router.get('/payment/class/six', isLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  return res.render('classSixFindFee', { isLoggedIn });
})

router.post('/payment/class/six/find/fee', isLoggedIn, async (req, res) => {
  try {
    const { name, roll } = req.body;
    const findStudent = await sixTHStudentModel.findOne({
      student_name: name,
      student_roll: roll 
    })
    if (!findStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/payment/class/six');
    }
    return res.render('classSixFee', { findStudent });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class six find fee error:', error.message);
    return res.redirect('/payment/class/six');
  }
});

router.get('/payment/class/six/find/fee/pay', isLoggedIn, async (req, res) => {
  res.render('classSixPaymentFees')
})

router.get('/payment/class/seven', isLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  return res.render('classSevenFindFee', { isLoggedIn });
})

router.post('/payment/class/seven/find/fee', isLoggedIn, async (req, res) => {
  try {
    const { name, roll } = req.body;
    
    let findStudent = await sevenTHStudentModel.findOne({
      student_name: name,
      student_roll: roll
    });
    if (!findStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/payment/class/seven');
    }
    return res.render('classSevenFee', { findStudent });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class seven find fee error:', error.message);
    return res.redirect('/payment/class/seven');
  }
});

router.get('/payment/class/seven/find/fee/pay', isLoggedIn, async (req, res) => {
  res.render('classSevenPaymentFees')
})

router.get('/payment/class/eight', isLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  return res.render('classEightFindFee', { isLoggedIn });
})

router.post('/payment/class/eight/find/fee', isLoggedIn, async (req, res) => {
  try {
    const { name, roll } = req.body;

    let findStudent = await eightTHStudentModel.findOne({
      student_name: name,
      student_roll: roll
    });
    if (!findStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/payment/class/eight');
    }
    return res.render('classEightFee', { findStudent });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class eight find fee error:', error.message);
    return res.redirect('/payment/class/eight');
  }
});

router.get('/payment/class/eight/find/fee/pay', isLoggedIn, async (req, res) => {
  res.render('classEightPaymentFees')
})

router.get('/payment/class/nine', isLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  return res.render('classNineFindFee', { isLoggedIn });
})

router.post('/payment/class/nine/find/fee', isLoggedIn, async (req, res) => {
  try {
    const { name, roll } = req.body;

    let findStudent = await nineTHStudentModel.findOne({
      student_name: name,
      student_roll: roll
    });
    if (!findStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/payment/class/nine');
    }
    return res.render('classNineFee', { findStudent });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class nine find fee error:', error.message);
    return res.redirect('/payment/class/nine');
  }
});

router.get('/payment/class/nine/find/fee/pay', isLoggedIn, async (req, res) => {
  res.render('classNinePaymentFees')
})

router.get('/payment/class/ten', isLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  return res.render('classTenFindFee', { isLoggedIn });
})

router.post('/payment/class/ten/find/fee', isLoggedIn, async (req, res) => {
  try {
    const { name, roll } = req.body;

    let findStudent = await tenTHStudentModel.findOne({
      student_name: name,
      student_roll: roll
    });
    if (!findStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/payment/class/ten');
    }
    return res.render('classTenFee', { findStudent });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class ten find fee error:', error.message);
    return res.redirect('/payment/class/ten');
  }
});

router.get('/payment/class/ten/find/fee/pay', isLoggedIn, async (req, res) => {
  res.render('classTenPaymentFees')
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