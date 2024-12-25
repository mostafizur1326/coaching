const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const post_image_upload = require("../utils/post-image-upload");
const teacher_photo_upload = require("../utils/teacher-photo-upload");
const student_photo_upload = require("../utils/student-photo-upload");

const class_six_result_upload = require("../utils/class-six-result-upload");
const class_seven_result_upload = require("../utils/class-seven-result-upload");
const class_eight_result_upload = require("../utils/class-eight-result-upload");
const class_nine_result_upload = require("../utils/class-nine-result-upload");
const class_ten_result_upload = require("../utils/class-ten-result-upload");


const { adminIsLoggedIn } = require("../middlewares/isLoggedIn");

const adminModel = require('../models/admin-model');
const postModel = require('../models/post-model');
const teacherModel = require('../models/teacher-model');

const sixTHStudentModel = require('../models/class-six-student-model');
const sevenTHStudentModel = require('../models/class-seven-student-model');
const eightTHStudentModel = require('../models/class-eight-student-model');
const nineTHStudentModel = require('../models/class-nine-student-model');
const tenTHStudentModel = require('../models/class-ten-student-model');

const classSixResultModel = require('../models/class-six-result-model');
const classSevenResultModel = require('../models/class-seven-result-model');
const classEightResultModel = require('../models/class-eight-result-model');
const classNineResultModel = require('../models/class-nine-result-model');
const classTenResultModel = require('../models/class-ten-result-model');

const sixTHPaymentModel = require('../models/class-six-payment-model');
const sevenTHPaymentModel = require('../models/class-seven-payment-model');
const eightTHPaymentModel = require('../models/class-eight-payment-model');
const nineTHPaymentModel = require('../models/class-nine-payment-model');
const tenTHPaymentModel = require('../models/class-ten-payment-model');

const dbgr = require('debug')('app: app');


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

router.get('/dashboard', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const classSixStudents = await sixTHStudentModel.getAllSixTHStudents();
  const classSevenStudents = await sevenTHStudentModel.getAllSevenTHStudents();
  const classEightStudents = await eightTHStudentModel.getAllEightTHStudents();
  const classNineStudents = await nineTHStudentModel.getAllNineTHStudents();
  const classTenStudents = await tenTHStudentModel.getAllTenTHStudents();

  let totalStudents = classSixStudents.length +
    classSevenStudents.length +
    classEightStudents.length +
    classNineStudents.length +
    classTenStudents.length

  const teachers = await teacherModel.getAllTeachers();
  res.render('dashboard', { isLoggedIn, totalStudents, teachers });
})

router.get('/all/students', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;

  const classSixStudents = await sixTHStudentModel.getAllSixTHStudents();
  const classSevenStudents = await sevenTHStudentModel.getAllSevenTHStudents();
  const classEightStudents = await eightTHStudentModel.getAllEightTHStudents();
  const classNineStudents = await nineTHStudentModel.getAllNineTHStudents();
  const classTenStudents = await tenTHStudentModel.getAllTenTHStudents();


  res.render('allStudents', {
    isLoggedIn,
    classSixStudents,
    classSevenStudents,
    classEightStudents,
    classNineStudents,
    classTenStudents
  });
})

router.post('/add/student', adminIsLoggedIn, (req, res) => {
  student_photo_upload.single('student_photo')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.flash('error', 'File size should not exceed 5MB.');
      } else if (err.message === 'Only .jpeg, .jpg, or .png files are allowed!') {
        req.flash('error', 'Invalid file type. Only .jpeg, .jpg, or .png files are allowed.');
      } else {
        req.flash('error', 'Something went wrong. Please try again.');
      }
      return res.redirect('/admin/all/students');
    }

    try {
      const { student_name, student_roll, student_class, student_fee, student_contact } = req.body;

      if (!student_name || !student_roll || !student_class || !student_fee || !student_contact) {
        req.flash('error', 'All fields are required!');
        return res.redirect('/admin/all/students');
      }

      const student_photo = req.file ? `/temp/students-photo/${req.file.filename}` : null;

      if (student_class === '6') {
        const classSixExistingStudent = await sixTHStudentModel.findOne({ student_roll });
        if (classSixExistingStudent) {
          req.flash('error', 'This roll already exists!');
          return res.redirect('/admin/all/students');
        }
        const newStudent = await sixTHStudentModel.create({
          student_photo,
          student_name,
          student_roll,
          student_class,
          student_fee,
          student_contact,
        });
      } else if (student_class === '7') {
        const classSevenExistingStudent = await sevenTHStudentModel.findOne({ student_roll });
        if (classSevenExistingStudent) {
          req.flash('error', 'This roll already exists!');
          return res.redirect('/admin/all/students');
        }
        const newStudent = await sevenTHStudentModel.create({
          student_photo,
          student_name,
          student_roll,
          student_class,
          student_fee,
          student_contact,
        });
      } else if (student_class === '8') {
        const classEightExistingStudent = await eightTHStudentModel.findOne({ student_roll });
        if (classEightExistingStudent) {
          req.flash('error', 'This roll already exists!');
          return res.redirect('/admin/all/students');
        }
        const newStudent = await eightTHStudentModel.create({
          student_photo,
          student_name,
          student_roll,
          student_class,
          student_fee,
          student_contact,
        });
      } else if (student_class === '9') {
        const classNineExistingStudent = await nineTHStudentModel.findOne({ student_roll });
        if (classNineExistingStudent) {
          req.flash('error', 'This roll already exists!');
          return res.redirect('/admin/all/students');
        }
        const newStudent = await nineTHStudentModel.create({
          student_photo,
          student_name,
          student_roll,
          student_class,
          student_fee,
          student_contact,
        });
      } else if (student_class === '10') {
        const classTenExistingStudent = await tenTHStudentModel.findOne({ student_roll });
        if (classTenExistingStudent) {
          req.flash('error', 'This roll already exists!');
          return res.redirect('/admin/all/students');
        }
        const newStudent = await tenTHStudentModel.create({
          student_photo,
          student_name,
          student_roll,
          student_class,
          student_fee,
          student_contact,
        });
      } else {
        req.flash('error', 'Something wwnt wrong! Please try again.');
        return res.redirect('/admin/all/students');
      }

      req.flash('success', 'Student added successfully!');
      return res.redirect('/admin/all/students');
    } catch (error) {
      req.flash('error', 'Student addition failed. Please try again.');
      dbgr('Unexpected error: ' + error);
      return res.redirect('/admin/all/students');
    }
  });
});

router.get('/class/six/student/details/:id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const classSixStudent = await sixTHStudentModel.findOne({ _id: req.params.id });
  res.render('classSixstudentDetails', { isLoggedIn, classSixStudent });
})

router.get('/class/six/student/delete/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classSixStudent = await sixTHStudentModel.findById(req.params.id);

    if (!classSixStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/admin/all/students');
    }

    if (classSixStudent.student_photo) {
      const studentPhotoPath = path.join(__dirname, '..', 'public', classSixStudent.student_photo);

      try {
        await fs.promises.unlink(studentPhotoPath);
      } catch (fileError) {
        dbgr(`Failed to delete student photo: ${fileError.message}`);
      }
    }

    await sixTHStudentModel.findByIdAndDelete(req.params.id);

    req.flash('success', `${classSixStudent.student_name} has been deleted.`);
    return res.redirect('/admin/all/students');
  } catch (error) {
    dbgr(`Error deleting student: ${error.message}`);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/admin/all/students');
  }
});

router.get('/class/seven/student/details/:id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const classSevenStudent = await sevenTHStudentModel.findOne({ _id: req.params.id });
  res.render('classSevenStudentDetails', { isLoggedIn, classSevenStudent });
})

router.get('/class/seven/student/delete/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classSevenStudent = await sevenTHStudentModel.findById(req.params.id);

    if (!classSevenStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/admin/all/students');
    }

    if (classSevenStudent.student_photo) {
      const studentPhotoPath = path.join(__dirname, '..', 'public', classSevenStudent.student_photo);

      try {
        await fs.promises.unlink(studentPhotoPath);
      } catch (fileError) {
        dbgr(`Failed to delete student photo: ${fileError.message}`);
      }
    }

    await sevenTHStudentModel.findByIdAndDelete(req.params.id);

    req.flash('success', `${classSevenStudent.student_name} has been deleted.`);
    return res.redirect('/admin/all/students');
  } catch (error) {
    dbgr(`Error deleting student: ${error.message}`);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/admin/all/students');
  }
});

router.get('/class/eight/student/details/:id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const classEightStudent = await eightTHStudentModel.findOne({ _id: req.params.id });
  res.render('classEightStudentDetails', { isLoggedIn, classEightStudent });
})

router.get('/class/eight/student/delete/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classEightStudent = await eightTHStudentModel.findById(req.params.id);

    if (!classEightStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/admin/all/students');
    }

    if (classEightStudent.student_photo) {
      const studentPhotoPath = path.join(__dirname, '..', 'public', classEightStudent.student_photo);

      try {
        await fs.promises.unlink(studentPhotoPath);
      } catch (fileError) {
        dbgr(`Failed to delete student photo: ${fileError.message}`);
      }
    }

    await eightTHStudentModel.findByIdAndDelete(req.params.id);

    req.flash('success', `${classEightStudent.student_name} has been deleted.`);
    return res.redirect('/admin/all/students');
  } catch (error) {
    dbgr(`Error deleting student: ${error.message}`);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/admin/all/students');
  }
});

router.get('/class/nine/student/details/:id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const classNineStudent = await nineTHStudentModel.findOne({ _id: req.params.id });
  res.render('classNineStudentDetails', { isLoggedIn, classNineStudent });
})

router.get('/class/nine/student/delete/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classNineStudent = await nineTHStudentModel.findById(req.params.id);

    if (!classNineStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/admin/all/students');
    }

    if (classNineStudent.student_photo) {
      const studentPhotoPath = path.join(__dirname, '..', 'public', classNineStudent.student_photo);

      try {
        await fs.promises.unlink(studentPhotoPath);
      } catch (fileError) {
        dbgr(`Failed to delete student photo: ${fileError.message}`);
      }
    }

    await nineTHStudentModel.findByIdAndDelete(req.params.id);

    req.flash('success', `${classNineStudent.student_name} has been deleted.`);
    return res.redirect('/admin/all/students');
  } catch (error) {
    dbgr(`Error deleting student: ${error.message}`);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/admin/all/students');
  }
});

router.get('/class/ten/student/details/:id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const classTenStudent = await tenTHStudentModel.findOne({ _id: req.params.id });
  res.render('classTenStudentDetails', { isLoggedIn, classTenStudent });
})

router.get('/class/ten/student/delete/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classTenStudent = await tenTHStudentModel.findById(req.params.id);

    if (!classTenStudent) {
      req.flash('error', 'Student not found!');
      return res.redirect('/admin/all/students');
    }

    if (classTenStudent.student_photo) {
      const studentPhotoPath = path.join(__dirname, '..', 'public', classTenStudent.student_photo);

      try {
        await fs.promises.unlink(studentPhotoPath);
      } catch (fileError) {
        dbgr(`Failed to delete student photo: ${fileError.message}`);
      }
    }

    await tenTHStudentModel.findByIdAndDelete(req.params.id);

    req.flash('success', `${classTenStudent.student_name} has been deleted.`);
    return res.redirect('/admin/all/students');
  } catch (error) {
    dbgr(`Error deleting student: ${error.message}`);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/admin/all/students');
  }
});

router.get('/all/teachers', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const teachers = await teacherModel.getAllTeachers();
  res.render('allTeachers', { isLoggedIn, teachers });
})

router.post('/add/teacher', adminIsLoggedIn, (req, res) => {
  teacher_photo_upload.single('teacher_photo')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.flash('error', 'File size should not exceed 5MB.');
      } else if (err.message === 'Only .jpeg, .jpg, or .png files are allowed!') {
        req.flash('error', 'Invalid file type. Only .jpeg, .jpg, or .png files are allowed.');
      } else {
        req.flash('error', 'Something went wrong. Please try again.');
      }
      return res.redirect('/admin/all/teachers');
    }

    try {
      const { teacher_name, teacher_subject, teacher_contact } = req.body;

      if (!req.file) {
        req.flash('error', 'Teacher photo is required!');
        return res.redirect('/admin/all/teachers');
      }
      if (!teacher_name || !teacher_subject || !teacher_contact) {
        req.flash('error', 'All fields are required!');
        return res.redirect('/admin/all/teachers');
      }

      const newTeacher = await teacherModel.create({
        teacher_photo: `/temp/teachers-photo/${req.file.filename}`,
        teacher_name,
        teacher_subject,
        teacher_contact,
      });

      req.flash('success', 'Teacher added successfully!');
      return res.redirect('/admin/all/teachers');
    } catch (error) {
      req.flash('error', 'Teacher addition failed. Please try again.');
      dbgr('Unexpected error: ' + error);
      return res.redirect('/admin/all/teachers');
    }
  });
});

router.get('/teacher/delete/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const teacher = await teacherModel.findById(req.params.id);

    if (!teacher) {
      req.flash('error', 'Teacher not found!');
      return res.redirect('/admin/all/teachers');
    }

    const teacherPhotoPath = path.join(__dirname, '..', 'public', teacher.teacher_photo);

    await fs.promises.unlink(teacherPhotoPath);

    await teacherModel.findByIdAndDelete(req.params.id);

    req.flash('success', `${teacher.teacher_name} has been deleted.`);
    return res.redirect('/admin/all/teachers');
  } catch (error) {
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/admin/all/teachers');
  }
});

router.get('/teacher/details/:id', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const teacher = await teacherModel.findOne({ _id: req.params.id });
  res.render('teacherDetails', { isLoggedIn, teacher });
})

router.get('/fees/management', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;

  const classSixPayments = await sixTHPaymentModel.getAllSixTHPayments();
  const classSevenPayments = await sevenTHPaymentModel.getAllSevenTHPayments();
  const classEightPayments = await eightTHPaymentModel.getAllEightTHPayments();
  const classNinePayments = await nineTHPaymentModel.getAllNineTHPayments();
  const classTenPayments = await tenTHPaymentModel.getAllTenTHPayments();


  let classSixPendingPayments = classSixPayments.filter(pendingPayments => pendingPayments.status === 'pending');
  let classSixApprovedPayments = classSixPayments.filter(approvedPayments => approvedPayments.status === 'approved');
  let classSixRejectedPayments = classSixPayments.filter(rejectedPayments => rejectedPayments.status === 'rejected');

  let classSevenPendingPayments = classSevenPayments.filter(pendingPayments => pendingPayments.status === 'pending');
  let classSevenApprovedPayments = classSevenPayments.filter(approvedPayments => approvedPayments.status === 'approved');
  let classSevenRejectedPayments = classSevenPayments.filter(rejectedPayments => rejectedPayments.status === 'rejected');

  let classEightPendingPayments = classEightPayments.filter(pendingPayments => pendingPayments.status === 'pending');
  let classEightApprovedPayments = classEightPayments.filter(approvedPayments => approvedPayments.status === 'approved');
  let classEightRejectedPayments = classEightPayments.filter(rejectedPayments => rejectedPayments.status === 'rejected');

  let classNinePendingPayments = classNinePayments.filter(pendingPayments => pendingPayments.status === 'pending');
  let classNineApprovedPayments = classNinePayments.filter(approvedPayments => approvedPayments.status === 'approved');
  let classNineRejectedPayments = classNinePayments.filter(rejectedPayments => rejectedPayments.status === 'rejected');

  let classTenPendingPayments = classTenPayments.filter(pendingPayments => pendingPayments.status === 'pending');
  let classTenApprovedPayments = classTenPayments.filter(approvedPayments => approvedPayments.status === 'approved');
  let classTenRejectedPayments = classTenPayments.filter(rejectedPayments => rejectedPayments.status === 'rejected');

  const classSixPaymentsCollectionName = sixTHPaymentModel.collection.name;
  const classSevenPaymentsCollectionName = sevenTHPaymentModel.collection.name;
  const classEightPaymentsCollectionName = eightTHPaymentModel.collection.name;
  const classNinePaymentsCollectionName = nineTHPaymentModel.collection.name;
  const classTenPaymentsCollectionName = tenTHPaymentModel.collection.name;

  res.render('feesManagement', {
    isLoggedIn,
    classSixPendingPayments,
    classSixApprovedPayments,
    classSixRejectedPayments,
    classSevenPendingPayments,
    classSevenApprovedPayments,
    classSevenRejectedPayments,
    classEightPendingPayments,
    classEightApprovedPayments,
    classEightRejectedPayments,
    classNinePendingPayments,
    classNineApprovedPayments,
    classNineRejectedPayments,
    classTenPendingPayments,
    classTenApprovedPayments,
    classTenRejectedPayments,
    classSixPaymentsCollectionName,
    classSevenPaymentsCollectionName,
    classEightPaymentsCollectionName,
    classNinePaymentsCollectionName,
    classTenPaymentsCollectionName
  });
})

router.get('/class/six/fee/details/delete/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classSixPaymentDetails = await sixTHPaymentModel.findOneAndDelete({ _id: req.params.id });

    if (!classSixPaymentDetails) {
      req.flash('error', 'Payment details not found!');
      return res.redirect('/admin/fees/management');
    }

    req.flash('success', `The payment details for ${classSixPaymentDetails.student_name} has been completely deleted.`);
    res.redirect('/admin/fees/management');
  } catch (error) {
    dbgr('Error during payment details deletion:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/fees/management');
  }
});

router.get('/class/six/fees/delete/all/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName;
  try {
     let model;
     if (mongoose.models[collectionName]) {
       model = mongoose.models[collectionName];
     } else {
       model = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
     }

     await model.deleteMany({});

    console.log(collectionName)

    req.flash('success', 'All payments for Class 6 have been successfully deleted!');
    res.status(200).redirect('/admin/fees/management');
  } catch (error) {
    dbgr('Failed to delete the database collection:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/fees/management');
  }
});

router.get('/post/management', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;
  const posts = await postModel.getAllPosts();
  res.render('postManagement', { isLoggedIn, posts });
})

router.post('/post/management/create', adminIsLoggedIn, (req, res) => {

  post_image_upload.single('post_image')(req, res, async (err) => {
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

    if (!postDetails || !postDetails.post_image) {
      req.flash('error', 'Post not found or no image associated.');
      return res.redirect('/admin/post/management');
    }

    const filePath = path.join(__dirname, '../public', postDetails.post_image);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    req.flash('success', `Post with ID: ${req.params.id} has been deleted successfully.`);
    res.redirect('/admin/post/management');
  } catch (error) {
    dbgr('Error during post deletion:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/post/management');
  }
});

router.get('/result/management', adminIsLoggedIn, async (req, res) => {
  const isLoggedIn = req.cookies.token;

  const classSixResults = await classSixResultModel.getAllclassSixResults();
  const classSevenResults = await classSevenResultModel.getAllclassSevenResults();
  const classEightResults = await classEightResultModel.getAllclassEightResults();
  const classNineResults = await classNineResultModel.getAllclassNineResults();
  const classTenResults = await classTenResultModel.getAllclassTenResults();

  const classSixCollectionName = classSixResultModel.collection.name;
  const classSevenCollectionName = classSevenResultModel.collection.name;
  const classEightCollectionName = classEightResultModel.collection.name;
  const classNineCollectionName = classNineResultModel.collection.name;
  const classTenCollectionName = classTenResultModel.collection.name;

  res.render('resultManagement', {
    isLoggedIn,
    classSixResults,
    classSevenResults,
    classEightResults,
    classNineResults,
    classTenResults,
    classSixCollectionName,
    classSevenCollectionName,
    classEightCollectionName,
    classNineCollectionName,
    classTenCollectionName
  });
})

router.post('/class/six/result/published', adminIsLoggedIn, (req, res) => {
  class_six_result_upload(req, res);
});

router.get('/class/six/restlt/delete/:roll/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classSixResult = await classSixResultModel.findOneAndDelete({ _id: req.params.id });

    if (!classSixResult || !classSixResult.class_six_result) {
      req.flash('error', 'Result not found!');
      return res.redirect('/admin/result/management');
    }

    const filePath = path.join(__dirname, '../public', classSixResult.class_six_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    req.flash('success', `The result for ${classSixResult.name} has been completely deleted.`);
    res.redirect('/admin/result/management');
  } catch (error) {
    dbgr('Error during result deletion:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.get('/class/six/result/delete/all/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName;
  try {
    let model;
    if (mongoose.models[collectionName]) {
      model = mongoose.models[collectionName];
    } else {
      model = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
    }

    const result = await model.findOne();
    const filePath = path.join(__dirname, '../public', result.class_six_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
            dbgr('File deletion error:', err);
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    await model.deleteMany({});
    req.flash('success', 'All results for Class 6 have been successfully deleted!');
    res.status(200).redirect('/admin/result/management');
  } catch (error) {
    dbgr('Failed to delete the database collection:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.post('/class/seven/result/published', adminIsLoggedIn, (req, res) => {
  class_seven_result_upload(req, res);
});

router.get('/class/seven/restlt/delete/:roll/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classSevenResult = await classSevenResultModel.findOneAndDelete({ _id: req.params.id });

    if (!classSevenResult || !classSevenResult.class_seven_result) {
      req.flash('error', 'Result not found!');
      return res.redirect('/admin/result/management');
    }

    const filePath = path.join(__dirname, '../public', classSevenResult.class_seven_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    req.flash('success', `The result for ${classSevenResult.name} has been completely deleted.`);
    res.redirect('/admin/result/management');
  } catch (error) {
    dbgr('Error during result deletion:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.get('/class/seven/result/delete/all/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName;
  try {
    let model;
    if (mongoose.models[collectionName]) {
      model = mongoose.models[collectionName];
    } else {
      model = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
    }

    const result = await model.findOne();
    const filePath = path.join(__dirname, '../public', result.class_seven_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
            dbgr('File deletion error:', err);
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    await model.deleteMany({});
    req.flash('success', 'All results for Class 7 have been successfully deleted!');
    res.status(200).redirect('/admin/result/management');
  } catch (error) {
    dbgr('Failed to delete the database collection:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.post('/class/eight/result/published', adminIsLoggedIn, (req, res) => {
  class_eight_result_upload(req, res);
});

router.get('/class/eight/restlt/delete/:roll/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classEightResult = await classEightResultModel.findOneAndDelete({ _id: req.params.id });

    if (!classEightResult || !classEightResult.class_eight_result) {
      req.flash('error', 'Result not found!');
      return res.redirect('/admin/result/management');
    }

    const filePath = path.join(__dirname, '../public', classEightResult.class_eight_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    req.flash('success', `The result for ${classEightResult.name} has been completely deleted.`);
    res.redirect('/admin/result/management');
  } catch (error) {
    dbgr('Error during result deletion:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.get('/class/eight/result/delete/all/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName;
  try {
    let model;
    if (mongoose.models[collectionName]) {
      model = mongoose.models[collectionName];
    } else {
      model = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
    }

    const result = await model.findOne();
    const filePath = path.join(__dirname, '../public', result.class_eight_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
            dbgr('File deletion error:', err);
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    await model.deleteMany({});
    req.flash('success', 'All results for Class 8 have been successfully deleted!');
    res.status(200).redirect('/admin/result/management');
  } catch (error) {
    dbgr('Failed to delete the database collection:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.post('/class/nine/result/published', adminIsLoggedIn, (req, res) => {
  class_nine_result_upload(req, res);
});

router.get('/class/nine/restlt/delete/:roll/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classNineResult = await classNineResultModel.findOneAndDelete({ _id: req.params.id });

    if (!classNineResult || !classNineResult.class_nine_result) {
      req.flash('error', 'Result not found!');
      return res.redirect('/admin/result/management');
    }

    const filePath = path.join(__dirname, '../public', classNineResult.class_nine_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    req.flash('success', `The result for ${classNineResult.name} has been completely deleted.`);
    res.redirect('/admin/result/management');
  } catch (error) {
    dbgr('Error during result deletion:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.get('/class/nine/result/delete/all/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName;
  try {
    let model;
    if (mongoose.models[collectionName]) {
      model = mongoose.models[collectionName];
    } else {
      model = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
    }

    const result = await model.findOne();
    console.log(result.class_nine_result)
    const filePath = path.join(__dirname, '../public', result.class_nine_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
            dbgr('File deletion error:', err);
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    await model.deleteMany({});
    req.flash('success', 'All results for Class 9 have been successfully deleted!');
    res.status(200).redirect('/admin/result/management');
  } catch (error) {
    dbgr('Failed to delete the database collection:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.post('/class/ten/result/published', adminIsLoggedIn, (req, res) => {
  class_ten_result_upload(req, res);
});

router.get('/class/ten/restlt/delete/:roll/:id', adminIsLoggedIn, async (req, res) => {
  try {
    const classTenResult = await classTenResultModel.findOneAndDelete({ _id: req.params.id });

    if (!classTenResult || !classTenResult.class_ten_result) {
      req.flash('error', 'Result not found!');
      return res.redirect('/admin/result/management');
    }

    const filePath = path.join(__dirname, '../public', classTenResult.class_ten_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    req.flash('success', `The result for ${classTenResult.name} has been completely deleted.`);
    res.redirect('/admin/result/management');
  } catch (error) {
    dbgr('Error during result deletion:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.get('/class/ten/result/delete/all/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName;
  try {
    let model;
    if (mongoose.models[collectionName]) {
      model = mongoose.models[collectionName];
    } else {
      model = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
    }

    const result = await model.findOne();
    const filePath = path.join(__dirname, '../public', result.class_ten_result);
    fs.exists(filePath, (exists) => {
      if (exists) {
        fs.unlink(filePath, (err) => {
          if (err) {
            req.flash('error', 'Error deleting file.');
            dbgr('File deletion error:', err);
          }
        });
      } else {
        dbgr("File does not exist:", filePath);
      }
    });

    await model.deleteMany({});
    req.flash('success', 'All results for Class 10 have been successfully deleted!');
    res.status(200).redirect('/admin/result/management');
  } catch (error) {
    dbgr('Failed to delete the database collection:', error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/admin/result/management');
  }
});

router.get('/logout', (req, res) => {
  res.cookie('token', '');
  res.redirect('/admin/login');
});

module.exports = router;