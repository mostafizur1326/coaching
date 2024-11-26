/*const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb)  {
    cb(null, './public/temp/student_documents');
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname.split(" ").join("");
    const randomString = crypto.randomBytes(4).toString("hex");
    const extension = path.extname(originalName);
    const finalName = `BPMHS_${randomString}${extension}`;
    cb(null, finalName);
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

module.exports = upload;*/

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/temp/student_documents');
  },
  filename: function(req, file, cb) {
    const originalName = file.originalname.split(" ").join("");
    const randomString = crypto.randomBytes(4).toString("hex");
    const extension = path.extname(originalName);
    const finalName = `BPMHS_${randomString}${extension}`;
    cb(null, finalName);
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