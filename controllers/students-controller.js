const studentModel = require("../models/student-model");

const createStudent = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;

    const newStudent = studentModel.create({
      ...data,
      student_photo: files.student_photo[0]?.path,
      father_nid: files.father_nid?.[0]?.path,
      mother_nid: files.mother_nid?.[0]?.path,
      transfer_certificate: files.transfer_certificate?.[0]?.path,
    });

    await newStudent.save();
    res.status(201).json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createStudent };