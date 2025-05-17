const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const userId = "f2c7433f-1afc-497c-8356-1fb09e4ed359";
const {analyzeReport} = require('../models/analysisModel');
const analysisModel = require('../models/analysisModel');
const { reportModel } = require('../models/reportModel');

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });


const extractData = (report) => {
  if (!report || !Array.isArray(report.organs)) {
    return [];
  }
  const {uploadDate} = report
  return report.organs.map((organEntry) => {
    const {
      organ,
      status,
      explanation,
      extractionFromReport: {
        testName,
        resultValue,
        expectedRange,
        unitOfMeasurement
      } = {}
    } = organEntry;

    return {
      uploadDate,
      organ,
      status,
      explanation,
      extractionFromReport: {
        testName,
        resultValue,
        expectedRange,
        unitOfMeasurement
      }
    };
  });   
};

const analyzeReport = async(req , res) => {
    console.log("Inside analysis")
    try{
        const {reportId1 , reportId2} = req.body; 

        // first find reports based on this ids 
        const getReports = await reportModel.find({
        reportId: { $in: [reportId1, reportId2] }
        });

        if(!getReports){
            res.status(409).send({
                status : "fail",
                message : " reports not found"
            })
        }

        // if found then extract report data

        let extractedReports  = [];
        getReports.map(report => {
           let getExtractedData = extractData(report);
           extractedReports.push(getExtractedData);
        })

         // Step 3: Sort by uploadDate to get older/newer
              extractedReports.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
          
              const reportA = extractedReports [0]; // Older
              const reportB = extractedReports [1]; // Newer
        

        // now we get extracted data in structured form so write prompt

        const fullPrompt = `
        You are a Health Assistant. Compare two medical reports from the same user to analyze improvements or declines in their health over time.
        
        Each report is a structured array of test results with the following fields:
        - uploadDate (ISO format)
        - organ
        - status (Normal, Borderline, or Critical)
        - explanation
        - extractionFromReport:
          - testName
          - resultValue
          - expectedRange
          - unitOfMeasurement
        
        Determine which report is older by comparing the uploadDate.
        
        For each test that appears in BOTH reports:
        1. Show test name
        2. Show old and new values
        3. Change: "Improved", "Declined", or "Same"
        4. Current status (from newer report)
        5. User-friendly feedback
        
        Ignore tests that appear in only one report.
        
        ---
        
        Report A (older):
        ${JSON.stringify(reportA.organs, null, 2)}
        
        Upload Date: ${reportA.uploadDate}
        
        Report B (newer):
        ${JSON.stringify(reportB.organs, null, 2)}
        
        Upload Date: ${reportB.uploadDate}
        
        ---
        
        Respond only in this JSON format:
        [
          { 
            "testName": "Vitamin B12",
            "organ": "Blood",
            "change": "Improved",
            "oldValue": "120",
            "newValue": "450",
            "expectedRange": "200-900",
            "unitOfMeasurement": "pg/mL",
            "statusNow": "Normal",
            "feedback": "Your Vitamin B12 is now in a healthy range. Great work!"
             "previousDate": "2024-10-10T08:15:00.000Z",
              "newDate": "2024-11-15T08:15:00.000Z"
          }
        ]
        `;

        // now call open api 
        const result = await model.generateContent(fullPrompt);
       const textResponse = await result.response.text();

           // Convert string to JavaScript object
           const jsonData = JSON.parse(textResponse);
           
           // Now jsonData is a usable JavaScript array or object
            jsonData;

          const compareId = uuidv4();  
          const createAnalysis = await analysisModel.create({
          userId: userId,
          reportIds: [reportId1, reportId2],
          analysisId: compareId,
          comparedAt: new Date(), // Optional, will default to Date.now
          testsCompared: jsonData
        });

        return res.status(200).send({
            status : "succes",
            message : "Report analysis successfully",
            analysisId : createAnalysis.analysisId
        })
         
                 
        } catch(err){

        res.status(500).send({
            status : "fail",
            message : "something wronged happen",
            error : err
        })
    }
}


const getAnalysisData = async(req , res) => {
    try{
          const {analysisId} = req.body;
          
          // now find analysis report
          const findAnalysis = await analysisModel.findOne({analysisId:analysisId});
          
          return res.status(200).send({
            status : "success",
            analysisData : findAnalysis
          })

    } catch(err){
        res.status(500).send({
            status : "fail",
            message : "something wrong in getting analysis",
            error : err
        })
    }
}


module.exports = {analyzeReport , getAnalysisData};