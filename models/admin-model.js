const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
  password: {
    type: String,
  },
  condition: {
    type: String,
    default: 'off'
  },
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);