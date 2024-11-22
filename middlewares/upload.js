const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/temp/upload"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "student_photo", maxCount: 1 },
  { name: "father_nid", maxCount: 1 },
  { name: "mother_nid", maxCount: 1 },
  { name: "transfer_certificate", maxCount: 1 },
]);

module.exports = upload;