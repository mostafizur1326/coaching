const express = require('express');
const router = express.Router();

const { isLoggedIn } = require("../middlewares/isLoggedIn");

const adminModel = require('../models/admin-model');
const postModel = require('../models/post-model');
const studentModel = require('../models/student-model');




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
    const students = await studentModel.getAllStudents();

    let classSixStudents = students.filter(student => student.student_class === '6');
    let findStudent = classSixStudents.find(student => student.student_roll === roll && student.student_name === name);

    if (!findStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/payment/class/six');
    }
    console.log(findStudent)
    return res.render('classSixFee', { findStudent });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class six find fee error:', error.message);
    return res.redirect('/payment/class/six');
  }
});

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