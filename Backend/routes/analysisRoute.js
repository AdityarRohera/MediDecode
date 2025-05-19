const express = require('express');
const analysisRouter = express.Router();

const analyzeReportHistoryController = require('../controllers/analyzeReportHistoryController');

analysisRouter.post('/analysis-report' , analyzeReportHistoryController.compareReport);
analysisRouter.get('/analysis-report/:analysisId' , analyzeReportHistoryController.getAnalysisData);

module.exports = {analysisRouter};