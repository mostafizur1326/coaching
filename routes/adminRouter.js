const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const post_image_upload = require("../utils/post-image-upload");
const teacher_photo_upload = require("../utils/teacher-photo-upload");

const { adminIsLoggedIn } = require("../middlewares/isLoggedIn");

const adminModel = require('../models/admin-model');
const postModel = require('../models/post-model');
const teacherModel = require('../models/teacher-model');

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

router.get('/dashboard', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('dashboard', { isLoggedIn });
})

router.get('/all/students', adminIsLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('allStudents', { isLoggedIn });
})

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