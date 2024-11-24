const express = require('express');
const router = express.Router();

const { createStudent } = require("../controllers/admission-students-controller");

const upload = require("../utils/upload");

const { isLoggedIn } = require("../middlewares/isLoggedIn");

//admission-student-model

router.get('/result', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/class', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('selectClass', { isLoggedIn });
})

router.get('/class/six', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/class/seven', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/class/eight', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/class/nine', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/class/ten', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/payment', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('paymentFees', { isLoggedIn });
})

router.get('/fees/class', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('selectClassFees', { isLoggedIn });
})

router.get('/fees/class/six/fees', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('schoolFees', { isLoggedIn });
})

router.get('/fees/class/seven/fees', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('schoolFees', { isLoggedIn });
})

router.get('/fees/class/eight/fees', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('schoolFees', { isLoggedIn });
})

router.get('/fees/class/nine/fees', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('schoolFees', { isLoggedIn });
})

router.get('/fees/class/ten/fees', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('schoolFees', { isLoggedIn });
})

router.get('/admission', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('admission', { isLoggedIn });
})

router.post('/admission/confirmation/successful', upload, createStudent, isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('admissionMessage', { isLoggedIn });
})

router.get('/settings', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('settings', { isLoggedIn });
})

router.get('/profile', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('profile', { isLoggedIn });
})

router.get('/profile/avatar', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('studentAvatar', { isLoggedIn });
});

router.post('/profile/avatar', isLoggedIn, /*upload.single('avatar'),*/ async (req, res) => {
  const { email } = req.user.email;
  console.log(req.file)
  const user = await userModel.findOne({ email });
  console.log(email)
  user.photo = req.file.filename;
  await user.save();
  res.redirect('/student/profile');
});


module.exports = router;