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

const compareReport = async(req , res) => {
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

              console.log("reportA -> ", reportA);
              console.log("reportB -> ", reportB);
        

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
        ${JSON.stringify(reportA, null, 2)}
        
        Upload Date: ${reportA[0].uploadDate}
        
        Report B (newer):
        ${JSON.stringify(reportB, null, 2)}
        
        Upload Date: ${reportB[0].uploadDate}
        
        ---
        
        IMPORTANT: You must respond with ONLY a valid JSON array in this exact format, with no additional text or explanation. Each object MUST have these exact fields:
        [
          { 
            "testName": "Vitamin B12",
            "organ": "Blood",
            "change": "Improved",  // Must be one of: "Improved", "Declined", "Same"
            "oldValue": "120",
            "newValue": "450",
            "expectedRange": "200-900",
            "statusNow": "Normal",  // Must be one of: "Normal", "Borderline", "Critical"
            "feedback": "Your Vitamin B12 is now in a healthy range. Great work!"
          }
        ]
        `;
console.log("analysis compare fullPrompt -> ", fullPrompt);
        // now call open api 
        const result = await model.generateContent(fullPrompt);
        const textResponse = result.response.text();
        console.log("analysis compare textResponse -> ", textResponse);

        let jsonData;
        try {
            // Clean the response text by removing markdown formatting
            const cleanResponse = textResponse
                .replace(/```json\n?/g, '')  // Remove opening ```json
                .replace(/```\n?/g, '')      // Remove closing ```
                .trim();                     // Remove any extra whitespace

            // Try to parse the response as JSON
            jsonData = JSON.parse(cleanResponse);
            console.log("analysis compare jsonData -> ", jsonData);
            
            // Validate that it's an array
            if (!Array.isArray(jsonData)) {
                throw new Error('Response is not an array');
            }

            // Validate each object in the array has required fields
            jsonData.forEach((item, index) => {
                const requiredFields = ['testName', 'change', 'oldValue', 'newValue', 'feedback'];
                const missingFields = requiredFields.filter(field => !item[field]);
                if (missingFields.length > 0) {
                    throw new Error(`Missing required fields in item ${index}: ${missingFields.join(', ')}`);
                }
                
                // Validate enum values
                if (!['Improved', 'Declined', 'Same'].includes(item.change)) {
                    throw new Error(`Invalid change value in item ${index}: ${item.change}`);
                }
                if (item.statusNow && !['Normal', 'Borderline', 'Critical'].includes(item.statusNow)) {
                    throw new Error(`Invalid statusNow value in item ${index}: ${item.statusNow}`);
                }
            });
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', parseError);
            console.error('Raw response:', textResponse);
            return res.status(500).send({
                status: "fail",
                message: "Failed to parse analysis response",
                error: parseError.message
            });
        }

        const compareId = uuidv4();  
        const createAnalysis = await analysisModel.create({
          userId: userId,
          reportId1: reportId1,
          reportId2: reportId2,
          analysisId: compareId,
          comparedAt: new Date(), // Optional, will default to Date.now
          testsCompared: jsonData
        });

        return res.status(200).send({
            status : "succes",
            message : "Report analysis successfully",
            compareId : createAnalysis.analysisId
        })
         
                 
        } catch(err){

          console.log("err -> ", err);

        res.status(500).send({
            status : "fail",
            message : "something wronged happend",
            error : err
        })
    }
}


const getAnalysisData = async(req , res) => {
    try{
          const {analysisId} = req.params;
          
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


module.exports = {compareReport , getAnalysisData};