const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String
  },
  age: {
    type: Number
  },
  posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ]
})

module.exports = mongoose.model('User', userSchema);