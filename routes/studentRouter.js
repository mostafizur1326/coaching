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
  res.render('sixResultForm', { isLoggedIn });
})

router.get('/class', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('classSelectForResult', { isLoggedIn });
})

router.get('/class/six', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('sixResultForm', { isLoggedIn });
});

router.post('/class/six/result', isLoggedIn, async (req, res) => {
  try {
    const { roll } = req.body;
    const result = await classSixResultModel.findOne({ roll });

    return res.render('classSixResultView', { result });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class six result error:', error.message);
    return res.redirect('/student/class/six');
  }
});

router.get('/class/six/result/download-pdf/:id', async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await classSixResultModel.findById(resultId);
    if (!result) {
      return req.flash('error', 'Result not found!');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Class_Six_Result_${result.roll}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Result Mark Sheet', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Roll: ${result.roll}`);
    doc.text(`Class: ${result.className}`);
    doc.text(`Name: ${result.name}`);
    doc.moveDown();

    const subjects = [
      'banglaFirstPaper', 'banglaSecondPaper', 'englishFirstPaper', 'englishSecondPaper',
      'math', 'science', 'ict', 'religion', 'bgs', 'agriculture'
    ];

    const columnWidth = [150, 50, 50, 50, 50]; // Column widths for CQ, MCQ, Total, GPA
    const rowHeight = 20;
    let currentY = doc.y;

    // Draw table header
    doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
    doc.text('Subject', 55, currentY + 5, { width: columnWidth[0], align: 'center' });

    doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
    doc.text('CQ', 205, currentY + 5, { width: columnWidth[1], align: 'center' });

    doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
    doc.text('MCQ', 255, currentY + 5, { width: columnWidth[2], align: 'center' });

    doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
    doc.text('Total', 305, currentY + 5, { width: columnWidth[3], align: 'center' });

    doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
    doc.text('GPA', 355, currentY + 5, { width: columnWidth[4], align: 'center' });

    currentY += rowHeight; // Move down after header

    // Draw each row of the table
    subjects.forEach(subject => {
      const subjectData = result[subject];
      if (subjectData && subjectData.cq !== undefined && subjectData.mcq !== undefined) {
        const { cq, mcq, total, gpa } = subjectData;

        // Draw row with borders
        doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
        doc.text(subject.replace(/([A-Z])/g, ' $1').trim(), 55, currentY + 5, { width: columnWidth[0], align: 'center' });

        doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
        doc.text(cq.toString(), 205, currentY + 5, { width: columnWidth[1], align: 'center' });

        doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
        doc.text(mcq.toString(), 255, currentY + 5, { width: columnWidth[2], align: 'center' });

        doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
        doc.text(total.toString(), 305, currentY + 5, { width: columnWidth[3], align: 'center' });

        doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
        doc.text(gpa.toString(), 355, currentY + 5, { width: columnWidth[4], align: 'center' });

        currentY += rowHeight; // Move down after each row
      }
    });

    doc.moveDown();
    doc.text(`Final GPA: ${result.finalGPA}`, { align: 'right' });

    doc.end();
  } catch (error) {
    dbgr('Error generating PDF:', error);
    req.flash('error', 'Download failed! Please try again.');
    return res.redirect('/student/class/six');
  }
});

router.get('/class/seven', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('sevenResultForm', { isLoggedIn });
})

router.post('/class/seven/result', isLoggedIn, async (req, res) => {
  try {
    const { roll } = req.body;
    const result = await classSevenResultModel.findOne({ roll });
    return res.render('classSevenResultView', { result });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class seven result error:', error.message);
    return res.redirect('/student/class/seven');
  }
});

router.get('/class/seven/result/download-pdf/:id', async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await classSevenResultModel.findById(resultId);
    if (!result) {
      return req.flash('error', 'Result not found!');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Class_Seven_Result_${result.roll}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Result Mark Sheet', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Roll: ${result.roll}`);
    doc.text(`Class: ${result.className}`);
    doc.text(`Name: ${result.name}`);
    doc.moveDown();

    const subjects = [
      'banglaFirstPaper', 'banglaSecondPaper', 'englishFirstPaper', 'englishSecondPaper',
      'math', 'science', 'ict', 'religion', 'bgs', 'agriculture'
    ];

    const columnWidth = [150, 50, 50, 50, 50]; // Column widths for CQ, MCQ, Total, GPA
    const rowHeight = 20;
    let currentY = doc.y;

    // Draw table header
    doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
    doc.text('Subject', 55, currentY + 5, { width: columnWidth[0], align: 'center' });

    doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
    doc.text('CQ', 205, currentY + 5, { width: columnWidth[1], align: 'center' });

    doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
    doc.text('MCQ', 255, currentY + 5, { width: columnWidth[2], align: 'center' });

    doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
    doc.text('Total', 305, currentY + 5, { width: columnWidth[3], align: 'center' });

    doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
    doc.text('GPA', 355, currentY + 5, { width: columnWidth[4], align: 'center' });

    currentY += rowHeight; // Move down after header

    // Draw each row of the table
    subjects.forEach(subject => {
      const subjectData = result[subject];
      if (subjectData && subjectData.cq !== undefined && subjectData.mcq !== undefined) {
        const { cq, mcq, total, gpa } = subjectData;

        // Draw row with borders
        doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
        doc.text(subject.replace(/([A-Z])/g, ' $1').trim(), 55, currentY + 5, { width: columnWidth[0], align: 'center' });

        doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
        doc.text(cq.toString(), 205, currentY + 5, { width: columnWidth[1], align: 'center' });

        doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
        doc.text(mcq.toString(), 255, currentY + 5, { width: columnWidth[2], align: 'center' });

        doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
        doc.text(total.toString(), 305, currentY + 5, { width: columnWidth[3], align: 'center' });

        doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
        doc.text(gpa.toString(), 355, currentY + 5, { width: columnWidth[4], align: 'center' });

        currentY += rowHeight; // Move down after each row
      }
    });

    doc.moveDown();
    doc.text(`Final GPA: ${result.finalGPA}`, { align: 'right' });

    doc.end();
  } catch (error) {
    dbgr('Error generating PDF:', error);
    req.flash('error', 'Download failed! Please try again.');
    return res.redirect('/student/class/six');
  }
});

router.get('/class/eight', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('eightResultForm', { isLoggedIn });
})

router.post('/class/eight/result', isLoggedIn, async (req, res) => {
  try {
    const { roll } = req.body;
    const result = await classEightResultModel.findOne({ roll });
    return res.render('classEightResultView', { result });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class eight result error:', error.message);
    return res.redirect('/student/class/eight');
  }
});

router.get('/class/eight/result/download-pdf/:id', async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await classEightResultModel.findById(resultId);
    if (!result) {
      return req.flash('error', 'Result not found!');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Class_Eight_Result_${result.roll}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Result Mark Sheet', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Roll: ${result.roll}`);
    doc.text(`Class: ${result.className}`);
    doc.text(`Name: ${result.name}`);
    doc.moveDown();

    const subjects = [
      'banglaFirstPaper', 'banglaSecondPaper', 'englishFirstPaper', 'englishSecondPaper',
      'math', 'science', 'ict', 'religion', 'bgs', 'agriculture'
    ];

    const columnWidth = [150, 50, 50, 50, 50]; // Column widths for CQ, MCQ, Total, GPA
    const rowHeight = 20;
    let currentY = doc.y;

    // Draw table header
    doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
    doc.text('Subject', 55, currentY + 5, { width: columnWidth[0], align: 'center' });

    doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
    doc.text('CQ', 205, currentY + 5, { width: columnWidth[1], align: 'center' });

    doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
    doc.text('MCQ', 255, currentY + 5, { width: columnWidth[2], align: 'center' });

    doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
    doc.text('Total', 305, currentY + 5, { width: columnWidth[3], align: 'center' });

    doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
    doc.text('GPA', 355, currentY + 5, { width: columnWidth[4], align: 'center' });

    currentY += rowHeight; // Move down after header

    // Draw each row of the table
    subjects.forEach(subject => {
      const subjectData = result[subject];
      if (subjectData && subjectData.cq !== undefined && subjectData.mcq !== undefined) {
        const { cq, mcq, total, gpa } = subjectData;

        // Draw row with borders
        doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
        doc.text(subject.replace(/([A-Z])/g, ' $1').trim(), 55, currentY + 5, { width: columnWidth[0], align: 'center' });

        doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
        doc.text(cq.toString(), 205, currentY + 5, { width: columnWidth[1], align: 'center' });

        doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
        doc.text(mcq.toString(), 255, currentY + 5, { width: columnWidth[2], align: 'center' });

        doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
        doc.text(total.toString(), 305, currentY + 5, { width: columnWidth[3], align: 'center' });

        doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
        doc.text(gpa.toString(), 355, currentY + 5, { width: columnWidth[4], align: 'center' });

        currentY += rowHeight; // Move down after each row
      }
    });

    doc.moveDown();
    doc.text(`Final GPA: ${result.finalGPA}`, { align: 'right' });

    doc.end();
  } catch (error) {
    dbgr('Error generating PDF:', error);
    req.flash('error', 'Download failed! Please try again.');
    return res.redirect('/student/class/six');
  }
});

router.get('/class/nine', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('nineResultForm', { isLoggedIn });
})

router.post('/class/nine/result', isLoggedIn, async (req, res) => {
  try {
    const { roll } = req.body;
    const result = await classNineResultModel.findOne({ roll });
    return res.render('classNineResultView', { result });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class nine result error:', error.message);
    return res.redirect('/student/class/nine');
  }
});

router.get('/class/nine/result/download-pdf/:id', async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await classNineResultModel.findById(resultId);
    if (!result) {
      req.flash('error', 'Result not found!');
      return res.redirect('/student/class/nine');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Class_Nine_Result_${result.roll}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Result Mark Sheet', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Roll: ${result.roll}`);
    doc.text(`Class: ${result.className}`);
    doc.text(`Name: ${result.name}`);
    doc.moveDown();

    const subjects = [
      'banglaFirstPaper', 'banglaSecondPaper', 'englishFirstPaper', 'englishSecondPaper',
      'math', 'physics', 'chemistry', 'biology', 'ict', 'religion', 'bgs', 'higherMath', 'agriculture'
    ];

    const columnWidth = [150, 50, 50, 50, 50];
    const rowHeight = 20;
    let currentY = doc.y;

    doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
    doc.text('Subject', 55, currentY + 5, { width: columnWidth[0], align: 'center' });

    doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
    doc.text('CQ', 205, currentY + 5, { width: columnWidth[1], align: 'center' });

    doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
    doc.text('MCQ', 255, currentY + 5, { width: columnWidth[2], align: 'center' });

    doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
    doc.text('Total', 305, currentY + 5, { width: columnWidth[3], align: 'center' });

    doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
    doc.text('GPA', 355, currentY + 5, { width: columnWidth[4], align: 'center' });

    currentY += rowHeight;

    subjects.forEach(subject => {
      const subjectData = result[subject] || {};
      const cq = subjectData.cq || 0;
      const mcq = subjectData.mcq || 0;
      const total = subjectData.total || 0;
      const gpa = subjectData.gpa || 0;

      doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
      doc.text(subject.replace(/([A-Z])/g, ' $1').trim(), 55, currentY + 5, { width: columnWidth[0], align: 'center' });

      doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
      doc.text(cq.toString(), 205, currentY + 5, { width: columnWidth[1], align: 'center' });

      doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
      doc.text(mcq.toString(), 255, currentY + 5, { width: columnWidth[2], align: 'center' });

      doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
      doc.text(total.toString(), 305, currentY + 5, { width: columnWidth[3], align: 'center' });

      doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
      doc.text(gpa.toString(), 355, currentY + 5, { width: columnWidth[4], align: 'center' });

      currentY += rowHeight;
    });

    doc.moveDown();
    doc.text(`Final GPA: ${result.finalGPA || 'N/A'}`, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    req.flash('error', 'Download failed! Please try again.');
    res.redirect('/student/class/nine');
  }
});

router.get('/class/ten', isLoggedIn, (req, res) => {
  const isLoggedIn = req.cookies.token;
  res.render('tenResultForm', { isLoggedIn });
})

router.post('/class/ten/result', isLoggedIn, async (req, res) => {
  try {
    const { roll } = req.body;
    const result = await classTenResultModel.findOne({ roll });
    return res.render('classTenResultView', { result });
  } catch (error) {
    req.flash('error', 'Something went wrong!');
    dbgr('Class ten result error:', error.message);
    return res.redirect('/student/class/ten');
  }
});

router.get('/class/ten/result/download-pdf/:id', async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await classTenResultModel.findById(resultId);
    if (!result) {
      req.flash('error', 'Result not found!');
      return res.redirect('/student/class/ten');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Class_Ten_Result_${result.roll}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Result Mark Sheet', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Roll: ${result.roll}`);
    doc.text(`Class: ${result.className}`);
    doc.text(`Name: ${result.name}`);
    doc.moveDown();

    const subjects = [
      'banglaFirstPaper', 'banglaSecondPaper', 'englishFirstPaper', 'englishSecondPaper',
      'math', 'physics', 'chemistry', 'biology', 'ict', 'religion', 'bgs', 'higherMath', 'agriculture'
    ];

    const columnWidth = [150, 50, 50, 50, 50];
    const rowHeight = 20;
    let currentY = doc.y;

    doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
    doc.text('Subject', 55, currentY + 5, { width: columnWidth[0], align: 'center' });

    doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
    doc.text('CQ', 205, currentY + 5, { width: columnWidth[1], align: 'center' });

    doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
    doc.text('MCQ', 255, currentY + 5, { width: columnWidth[2], align: 'center' });

    doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
    doc.text('Total', 305, currentY + 5, { width: columnWidth[3], align: 'center' });

    doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
    doc.text('GPA', 355, currentY + 5, { width: columnWidth[4], align: 'center' });

    currentY += rowHeight;

    subjects.forEach(subject => {
      const subjectData = result[subject] || {};
      const cq = subjectData.cq || 0;
      const mcq = subjectData.mcq || 0;
      const total = subjectData.total || 0;
      const gpa = subjectData.gpa || 0;

      doc.rect(50, currentY, columnWidth[0], rowHeight).stroke();
      doc.text(subject.replace(/([A-Z])/g, ' $1').trim(), 55, currentY + 5, { width: columnWidth[0], align: 'center' });

      doc.rect(200, currentY, columnWidth[1], rowHeight).stroke();
      doc.text(cq.toString(), 205, currentY + 5, { width: columnWidth[1], align: 'center' });

      doc.rect(250, currentY, columnWidth[2], rowHeight).stroke();
      doc.text(mcq.toString(), 255, currentY + 5, { width: columnWidth[2], align: 'center' });

      doc.rect(300, currentY, columnWidth[3], rowHeight).stroke();
      doc.text(total.toString(), 305, currentY + 5, { width: columnWidth[3], align: 'center' });

      doc.rect(350, currentY, columnWidth[4], rowHeight).stroke();
      doc.text(gpa.toString(), 355, currentY + 5, { width: columnWidth[4], align: 'center' });

      currentY += rowHeight;
    });

    doc.moveDown();
    doc.text(`Final GPA: ${result.finalGPA || 'N/A'}`, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    req.flash('error', 'Download failed! Please try again.');
    res.redirect('/student/class/ten');
  }
});

module.exports = router;