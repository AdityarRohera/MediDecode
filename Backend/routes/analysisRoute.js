const express = require('express');
const analysisRouter = express.Router();

const {analyzeReport , getAnalysisData} = require('../controllers/analyzeReportHistoryController')

analysisRouter.post('/analysis-report' , analyzeReport);
analysisRouter.get('analysis-report' , getAnalysisData);

module.exports = {analysisRouter};