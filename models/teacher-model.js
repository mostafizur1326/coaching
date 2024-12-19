const mongoose = require("mongoose");

const addTeacherSchema = new mongoose.Schema({
  teacher_photo: {
    type: String,
  },
  teacher_name: {
    type: String,
  },
  teacher_subject: {
    type: String,
  },
  teacher_contact: {
    type: String,
  },
}, { timestamps: true });

addTeacherSchema.statics.getAllTeachers = function() {
  return this.find();
};
module.exports = mongoose.model("AddTeacher", addTeacherSchema);