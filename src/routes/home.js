const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.models.js');
const postModel = require('../models/post.models.js');


router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;

/*router.get('/delete', async (req, res) => {
  const user = await userModel.findOneAndDelete({
    email: "mostafizurrahman@gmail.com"
  })
  res.send(user);
});

router.get('/create', async (req, res) => {
  const user = await userModel.create({
    username: "mostafizurrahman",
    email: "mostafizurrahman@gmail.com",
    age: 15
  })
  res.send(user);
});

router.get('/all', async (req, res) => {
  const user = await userModel.find()
  res.send(user);
});

router.get('/post', async (req, res) => {
  const post = await postModel.create({
    postData: "Hello Backend Mama",
    user: "67301967249b48c8609c417f",
  })
  
  let user = await userModel.findOne({
    _id: "67301967249b48c8609c417f"
  })
  user.posts.push(post._id);
  await user.save();
  res.send(post);
});
*/

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

