const mongoose = require('mongoose');

const userShcema = mongoose.Schema({
  username: String,
  fullname: String,
  email: String,
  password: String,
})

module.exports = mongoose.model('User', userShcema);