/* 
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const crypto = require("crypto");
const path = require("path");

// AWS S3 কনফিগারেশন
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// S3 স্টোরেজ কনফিগারেশন
const storage = multerS3({
  s3: s3,
  bucket: "your-s3-bucket-name", // আপনার S3 বালতি নাম দিন
  acl: "public-read", // ফাইলকে পাবলিক করতে চাইলে, অন্যথায় 'private'
  key: function(req, file, cb) {
    const originalName = file.originalname.split(" ").join("");
    const randomString = crypto.randomBytes(4).toString("hex");
    const extension = path.extname(originalName);
    const finalName = `BPMHS_${randomString}${extension}`;
    cb(null, finalName); // S3-তে ফাইল নাম
  }
});

// multer কনফিগারেশন
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // ৫MB ফাইল সাইজ লিমিট
}).fields([
  { name: "student_photo", maxCount: 1 },
  { name: "father_nid", maxCount: 1 },
  { name: "mother_nid", maxCount: 1 },
  { name: "transfer_certificate", maxCount: 1 },
]);

module.exports = upload;
*/

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