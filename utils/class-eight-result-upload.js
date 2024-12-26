const multer = require("multer");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");
const classEightResultModel = require('../models/class-eight-result-model');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = "./public/temp/result-files";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const extension = path.extname(file.originalname);
    const finalName = `Class_Eight_Result_File_${Date.now()}${extension}`;
    cb(null, finalName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (extension !== ".xlsx") {
      cb(new Error("Invalid file type. Only .xlsx files are allowed."));
    } else {
      cb(null, true);
    }
  },
}).single("class_eight_result");

const handleFileUpload = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        req.flash("error", "File size exceeds the limit of 5MB.");
      } else if (err.message === "Invalid file type. Only .xlsx files are allowed.") {
        req.flash("error", err.message);
      } else {
        req.flash("error", "File upload failed.");
      }
      return res.redirect("/admin/result/management");
    }

    const file = req.file;
    if (!file) {
      req.flash("error", "Please select a file.");
      return res.redirect("/admin/result/management");
    }

    try {
      const wb = XLSX.readFile(file.path);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });

      if (!data.length) {
        throw new Error("No data found in the sheet or sheet is empty.");
      }

      for (let row of data) {
        const existingRecord = await classEightResultModel.findOne({ roll: row["Roll"] });
        if (existingRecord) {
          req.flash("error", `Roll ${row["Roll"]} already exists.`);
          fs.unlinkSync(file.path);
          return res.redirect("/admin/result/management");
        }

        await classEightResultModel.create({
          name: row["Name"],
          roll: row["Roll"],
          className: row["Class"],
          banglaFirstPaper: {
            cq: row["Bangla 1st Paper (CQ)"],
            mcq: row["Bangla 1st Paper (MCQ)"],
            total: row["Bangla 1st Paper (Total)"],
            gpa: row["Bangla 1st Paper (GPA)"],
          },
          banglaSecondPaper: {
            cq: row["Bangla 2nd Paper (CQ)"],
            mcq: row["Bangla 2nd Paper (MCQ)"],
            total: row["Bangla 2nd Paper (Total)"],
            gpa: row["Bangla 2nd Paper (GPA)"],
          },
          englishFirstPaper: {
            cq: row["English 1st Paper (CQ)"],
            mcq: row["English 1st Paper (MCQ)"],
            total: row["English 1st Paper (Total)"],
            gpa: row["English 1st Paper (GPA)"],
          },
          englishSecondPaper: {
            cq: row["English 2nd Paper (CQ)"],
            mcq: row["English 2nd Paper (MCQ)"],
            total: row["English 2nd Paper (Total)"],
            gpa: row["English 2nd Paper (GPA)"],
          },
          math: {
            cq: row["Math (CQ)"],
            mcq: row["Math (MCQ)"],
            total: row["Math (Total)"],
            gpa: row["Math (GPA)"],
          },
          science: {
            cq: row["Science (CQ)"],
            mcq: row["Science (MCQ)"],
            total: row["Science (Total)"],
            gpa: row["Science (GPA)"],
          },
          ict: {
            cq: row["ICT (CQ)"],
            mcq: row["ICT (MCQ)"],
            total: row["ICT (Total)"],
            gpa: row["ICT (GPA)"],
          },
          religion: {
            cq: row["Religion (CQ)"],
            mcq: row["Religion (MCQ)"],
            total: row["Religion (Total)"],
            gpa: row["Religion (GPA)"],
          },
          bgs: {
            cq: row["BGS (CQ)"],
            mcq: row["BGS (MCQ)"],
            total: row["BGS (Total)"],
            gpa: row["BGS (GPA)"],
          },
          agriculture: {
            cq: row["Agriculture (CQ)"],
            mcq: row["Agriculture (MCQ)"],
            total: row["Agriculture (Total)"],
            gpa: row["Agriculture (GPA)"],
          },
          finalGPA: row["Final GPA"],
          class_eight_result: `/temp/result-files/${req.file.filename}`
        });
      }

      req.flash("success", "Class eight result successfully published.");
      res.redirect("/admin/result/management");
    } catch (err) {
      req.flash("error", "To upload your result, please delete the entire result list and try again.");
      return res.redirect("/admin/result/management");
    }
  });
};

module.exports = handleFileUpload;