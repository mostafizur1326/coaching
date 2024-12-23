const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  username: {
    type: String,
    default: `student_${Date.now()}`,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  number: {
    type: Number,
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