const express = require('express');
const router = express.Router();
//const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const dbgr = require('debug')('app: app');

const adminModel = require('../models/admin-model');
const admissionStudentModel = require('../models/admission-student-model');

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

      // Ensure token is set correctly, possibly add more options like `secure` or `httpOnly`
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return res.redirect('/admin/dashboard');
    } else {
      return res.render('adminLoginError', { message: 'Invalid email or password!' });
    }
  } catch (error) {
    res.status(500).render('adminLoginError', { message: 'Something went wrong!' });
  }
});

/*router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.redirect('/admin/registration');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const token = jwt.sign({ email, adminId: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });

      res.cookie('token', token);
      return res.redirect('/admin/dashboard');
    } else {
      return res.render('adminLoginError', { message: 'Invalid email or password!' });
    }
  } catch (error) {
    res.status(500).render('adminLoginError', { message: 'Something went wrong!' });
  }
});*/

router.get('/dashboard', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('dashboard', { isLoggedIn });
})

router.get('/admission/management', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;

  try {
    const allAdmittedStudent = await admissionStudentModel.find();

    let pendingStudents = allAdmittedStudent.filter(admittedStudent => admittedStudent.student_status === 'pending');

    let approvedStudents = allAdmittedStudent.filter(admittedStudent => admittedStudent.student_status === 'approved');

    let rejectedStudents = allAdmittedStudent.filter(admittedStudent => admittedStudent.student_status === 'rejected');
    
    res.status(201).render('admissionManagement', { isLoggedIn, pendingStudents, approvedStudents, rejectedStudents });
  } catch (error) {
    res.status(500).render('errorHandler', { isLoggedIn, error });
  }
})

router.get('/admitted/student/details/:student_id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  try {
    const student_id = req.params.student_id;
    const student = await admissionStudentModel.findOne({ _id: student_id })
    
    res.render('studentDetails', { isLoggedIn, student });
  } catch (error) {
    res.status(500).render('errorHandler', { isLoggedIn, error });
  }
});

router.get('/admitted/student/approved/:student_id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  try {
    const student_id = req.params.student_id;
    const student = await admissionStudentModel.findOneAndUpdate({ _id: student_id,  student_status: 'approved'})

    res.redirect('/admin/admission/management');
  } catch (error) {
    res.status(500).render('errorHandler', { isLoggedIn, error });
  }
});

router.get('/admitted/student/rejected/:student_id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  try {
    const student_id = req.params.student_id;
    const student = await admissionStudentModel.findOneAndUpdate({ _id: student_id, student_status: 'rejected' })

    res.redirect('/admin/admission/management');
  } catch (error) {
    res.status(500).render('errorHandler', { isLoggedIn, error });
  }
});

router.get('/post/management', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('postManagement', { isLoggedIn });
})

router.get('/result/management', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultManagement', { isLoggedIn });
})

router.get('/others/management', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('othersManagement', { isLoggedIn });
})

router.get('/logout', (req, res) => {
  res.cookie('token', '');
  res.redirect('/admin/login');
});

module.exports = router;