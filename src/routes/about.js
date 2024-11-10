const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

/* 
router.get('/about', (req, res) => {
  bcrypt.compare('Mostafizur123466', '$2a$10$DRmPgnSPnaJcVeIEE.aqyOn3mID5wt1INuE8.F1cgcJYKtaJIDFoG', function(err, pw) {
    if (pw === true) {
      res.render('about');
    } else {
      res.send('opps')
    }
  });
});
*/

router.get('/about', (req, res) => {
  res.render('about');
});


module.exports = router; 