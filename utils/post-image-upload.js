const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

//POST_IMAGE_UPLOAD

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/temp/post-images'); 
  },
  filename: function(req, file, cb) {
    const originalName = file.originalname.split(" ").join("");
    const randomString = crypto.randomBytes(4).toString("hex");
    const extension = path.extname(originalName);
    const finalName = `STEC_${randomString}${extension}`;
    cb(null, finalName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;