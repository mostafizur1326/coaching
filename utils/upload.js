const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/temp/student_documents"));
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

/*const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../public/temp/avatar');
  },
  filename: function(req, file, cb) {
    crypto.randomBytes(12, (err, name) => {
      const fn = name.toString('hex') + path.extname(file.originalname);
      cb(null, fn);
    });
  }
})
const upload = multer({ storage: storage })

module.exports = upload;*/