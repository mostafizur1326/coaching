const mongoose = require("mongoose");

const nineTHStudentSchema = new mongoose.Schema({
  student_photo: {
    type: String
  },
  student_name: {
    type: String,
  },
  student_class: {
    type: String,
  },
  student_roll: {
    type: String,
    unique: true
  },
  student_fee: {
    type: String,
  },
  student_contact: {
    type: String,
  },
}, { timestamps: true });

nineTHStudentSchema.statics.getAllNineTHStudents = function() {
  return this.find();
};
module.exports = mongoose.model("nineTHStudent", nineTHStudentSchema);