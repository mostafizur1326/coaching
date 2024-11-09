const express = require('express');
const router = express.Router();
//const userModels = require('../models/user.models.js');


router.get('/about', (req, res) => {
 // res.cookie('name', 'Mostafiz');
  console.log(req.cookies);
  res.render('about');
});

module.exports = router;