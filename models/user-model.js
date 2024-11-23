const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  username: {
    type: String,
    default: `student_${Date.now()}`
  },
  email: {
    type: String,
  },
  number: {
    type: String,
  },
  password: {
    type: String,
  },
  confirmpassword: {
    type: String,
  },
  condition: {
    type: String,
    default: 'off'
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);