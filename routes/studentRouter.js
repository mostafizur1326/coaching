const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

const { isLoggedIn } = require("../middlewares/isLoggedIn");

const classSixResultModel = require('../models/class-six-result-model');
const classSevenResultModel = require('../models/class-seven-result-model');
const classEightResultModel = require('../models/class-eight-result-model');
const classNineResultModel = require('../models/class-nine-result-model');
const classTenResultModel = require('../models/class-ten-result-model');

const dbgr = require('debug')('app: app');


router.get('/result', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/class', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('classSelectForResult', { isLoggedIn });
})

router.get('/class/six', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
});

router.post('/class/six/result', isLoggedIn, async (req, res) => {
  try {
    const { roll } = req.body;
    const result = await classSixResultModel.findOne({ roll });
    if (!result) {
      req.flash('error', 'No result found for this roll number!');
      return res.redirect('/student/class/six');
    }
    return res.render('classSixToEightResultView', { result });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class six result error:', error.message);
    return res.redirect('/student/class/six');
  }
});

router.get('/student/class/six/result/download-pdf/:id', async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await classSixResultModel.findById(resultId);

    if (!result) {
      return req.flash('error', 'Result not found!');
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Result_${result.roll}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Result Mark Sheet', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Roll: ${result.roll}`);
    doc.text(`Name: ${result.name}`);
    doc.moveDown();

    doc.fontSize(10).text('Subject      CQ     MCQ    Total     GPA');
    doc.moveDown();

    for (const subject of Object.keys(result)) {
      if (result[subject].cq) {
        doc.text(
          `${subject}    ${result[subject].cq}    ${result[subject].mcq}    ${
            result[subject].cq + result[subject].mcq
          }    ${result[subject].gpa}`
        );
      }
    }

    doc.moveDown();
    doc.text(`Final GPA: ${result.finalGPA}`, { align: 'right' });

    doc.end();
  } catch (error) {
    dbgr('Error generating PDF:', error);
    req.flash('error', 'Download failed! Please try again.');
  }
});

router.get('/class/seven', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/class/eight', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/class/nine', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

router.get('/class/ten', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('resultForm', { isLoggedIn });
})

module.exports = router;