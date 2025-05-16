const express = require('express');
const reportRouter = express.Router();
const {analyzeReport, getReportById} = require('../controllers/reportController')
const multer = require('multer');


const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') cb(null, true);
      else cb(new Error('Only PDF files are allowed!'), false);
    },
  });

reportRouter.post('/analyze', upload.single('file'), analyzeReport);
reportRouter.get('/:reportId', getReportById);

module.exports = {reportRouter};
