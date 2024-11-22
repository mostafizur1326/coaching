const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  student_name: {
    type: String,
    
  },
  dob: {
    type: Date,
    
  },
  gender: {
    type: String,
    
  },
  religion: {
    type: String,
    
  },
  nationality: {
    type: String,
    
  },
  class_name: {
    type: String,
    
  },
  father_name: {
    type: String,
    
  },
  father_nid: {
    type: String
  },
  mother_name: {
    type: String,
    
  },
  mother_nid: {
    type: String
  },
  guardian_contact: {
    type: String,
    
  },
  guardian_email: {
    type: String,
    
  },
  guardian_profession: {
    type: String,
    
  },
  permanent_address: {
    type: String,
    
  },
  current_address: {
    type: String
  },
  previous_school: {
    type: String
  },
  transfer_certificate: {
    type: String
  },
  student_photo: {
    type: String,
    
  },
  payment_method: {
    type: String,
    
  },
  sending_number: {
    type: String,
    
  },
  transaction_id: {
    type: String,
    
  },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);