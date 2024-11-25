const admissionStudentModel = require("../models/admission-student-model");

const createStudent = async (req, res) => {
  try {
    const {
      student_name,
      dob,
      gender,
      religion,
      nationality,
      class_name,
      father_name,
      mother_name,
      guardian_contact,
      guardian_email,
      guardian_profession,
      permanent_address,
      current_address,
      previous_school,
      payment_method,
      sending_number,
      transection_id,
      condition,
      condition2
    } = req.body;

    const {
      student_photo,
      mother_nid,
      father_nid,
      transfer_certificate
    } = req.files;

    const newAdmittedStudent = await admissionStudentModel.create({
      student_name,
      dob,
      gender,
      religion,
      nationality,
      class_name,
      father_name,
      mother_name,
      guardian_contact,
      guardian_email,
      guardian_profession,
      permanent_address,
      current_address,
      previous_school,
      condition,
      payment_method,
      sending_number,
      transection_id,
      condition2,
      student_photo: student_photo[0]?.path,
      father_nid: father_nid?.[0]?.path,
      mother_nid: mother_nid?.[0]?.path,
      transfer_certificate: transfer_certificate?.[0]?.path,
    });

    console.log(newAdmittedStudent);
    res.status(201).json({ message: "Student added successfully", student: newAdmittedStudent });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something want wrong! Please try aging.')
    res.status(500).redirect('/student/admission');
  }
};

module.exports = { createStudent };