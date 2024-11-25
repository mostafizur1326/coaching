const express = require('express');
const router = express.Router();

const admissionStudentModel = require("../models/admission-student-model");

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

router.post('/admission/confirmation/successful', isLoggedIn, upload, async (req, res) => {
  const isLoggedIn = req.cookies.token;

  try {
    const {
      student_name,
      dob,
      gender,
      religion,
      nationality,
      class_name,
      father_name,
      mother_name,
      guardian_contact,
      guardian_email,
      guardian_profession,
      permanent_address,
      current_address,
      previous_school,
      payment_method,
      sending_number,
      transaction_id,
      condition,
      condition2,
    } = req.body;

    const { student_photo, mother_nid, father_nid, transfer_certificate } = req.files;

    const existingAdmittedStudent = await admissionStudentModel.findOne({
      $or: [{ guardian_email }, { transaction_id }],
    });

    let newAdmittedStudent = null;

    if (existingAdmittedStudent) {
      req.flash('existing', 'This transaction ID has already been used, & the student already exists.');
      return res.status(409).redirect('/student/admission');
    } else {
      newAdmittedStudent = await admissionStudentModel.create({
        student_name,
        dob,
        gender,
        religion,
        nationality,
        class_name,
        father_name,
        mother_name,
        guardian_contact,
        guardian_email,
        guardian_profession,
        permanent_address,
        current_address,
        previous_school,
        condition,
        payment_method,
        sending_number,
        transaction_id,
        condition2,
        student_photo: student_photo?.[0]?.path,
        father_nid: father_nid?.[0]?.path,
        mother_nid: mother_nid?.[0]?.path,
        transfer_certificate: transfer_certificate?.[0]?.path,
      });
    }

    console.log(newAdmittedStudent);
    res.status(201).render('admissionMessage', { isLoggedIn });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong! Please try again.');
    res.status(500).redirect('/student/admission');
  }
});

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