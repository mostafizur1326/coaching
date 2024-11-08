const express = require('express');
const router = express.Router();
const userModels = require('../models/user.models.js');


router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;