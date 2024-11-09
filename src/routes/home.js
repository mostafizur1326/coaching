const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;

/*router.get('/', (req, res) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash('Mostafizur123466', salt, function(err, hash) {
      // Store hash in your password DB.
      console.log(hash)
    });
  });
  res.render('index');
});
*/

/* router.get('/', (req, res) => {
  let token = jwt.sign({ email: 'mostafiz@mail.com' }, '1315192016926');
  res.cookie('token', token);
  console.log(req.cookies.token);
  res.render('index');
});

router.get('/read', (req, res) => {
  let data = jwt.verify(req.cookies.token, '1315192016926');
  console.log(data);
  res.send('Data received');
});
 */

