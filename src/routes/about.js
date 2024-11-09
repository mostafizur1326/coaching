const express = require('express');
const router = express.Router();
//const userModels = require('../models/user.models.js');


router.get('/about', (req, res) => {
  res.render('about');
});

module.exports = router;