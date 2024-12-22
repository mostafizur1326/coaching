const mongoose = require("mongoose");

const addStudentSchema = new mongoose.Schema({
  student_photo: {
    type: String,
  },
  student_name: {
    type: String,
  },
  student_class: {
    type: String,
  },
  student_roll: {
    type: String,
  },
  student_fee: {
    type: String,
  },
  student_contact: {
    type: String,
  },
}, { timestamps: true });

addStudentSchema.statics.getAllStudents = function() {
  return this.find();
};
module.exports = mongoose.model("AddStudent", addStudentSchema);