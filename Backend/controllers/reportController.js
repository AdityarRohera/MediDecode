const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const reportModel = require('../models/reportModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Helper function to clean JSON string
function cleanJsonString(str) {
    // Remove markdown code block if present
    str = str.replace(/```json\n?|\n?```/g, '');
    // Remove any leading/trailing whitespace
    str = str.trim();
    return str;
}

async function analyzeReport(req, res) {
    console.log("Analyzing report");
    try {
        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);

        // Convert PDF to base64
        const base64Data = fileBuffer.toString('base64');

        // Custom prompt logic
        const prompt = `You are a Health Assistant that specializes in analyzing medical reports.

Given a medical report (PDF), your job is to:
1. Identify and extract all the **test names** present in the report.
2. For each test:
    - Extract the **result value**
    - Extract the **expected range**
    - Extract the **unit of measurement**
    - Determine which **organ or body system** it relates to (e.g., heart, liver, kidney, blood, sugar, etc.)
3. Based on the result and the expected range, **classify the status** as one of:
    - "Normal"
    - "Borderline"
    - "Critical"
4. For each test (grouped by organ/system), provide an **explanation** of the result in **very simple, friendly language** — something even a 5-year-old could understand.

Respond ONLY in the following JSON format (no markdown formatting, just pure JSON):
[
  {
    "organ": "Liver",
    "status": "Normal",
    "explanation": "Your liver is doing just fine! It's working happily.",
    "extractionFromReport": {
      "testName": "ALT (SGPT)",
      "resultValue": "25",
      "expectedRange": "7-56",
      "unitOfMeasurement": "U/L"
    }
  }
]`

        // Generate content
        const response = await model.generateContent({
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: "application/pdf",
                            data: base64Data
                        }
                    }
                ]
            }]
        });

        const resultText = response.response.text();
        let resultJson;
        try {
            // Clean the response text before parsing
            const cleanedText = cleanJsonString(resultText);
            resultJson = JSON.parse(cleanedText);
        } catch (err) {
            console.error('Error parsing response:', err);
            resultJson = [];
        }

        const reportId = uuidv4();
        const report = new reportModel({
            userId: new mongoose.Types.ObjectId(), // Generate a new ObjectId
            reportId: reportId,
            fileName: req.file.originalname,
            fileUrl: filePath,
            summary: resultJson,
            organs: resultJson.map(item => ({
                organ: item.organ,
                status: item.status,
                explanation: item.explanation,
                extractionFromReport: item.extractionFromReport
            }))
        });
        await report.save();

        console.log("Report saved successfully");
        res.json({ analyzed: true, reportId: reportId, report: report });

        // Clean up the uploaded file
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error('Error in analyzeReport:', error);
        
        // Handle quota exceeded error specifically
        if (error.message && error.message.includes('quota')) {
            return res.status(429).json({
                error: 'API Quota Exceeded',
                message: 'API quota exceeded. Please try again later or upgrade your API plan.',
                details: 'The free tier of Gemini API has been exhausted. Please wait 24 hours or upgrade to a paid plan.'
            });
        }

        // Handle other errors
        res.status(500).json({ 
            error: 'Error processing PDF',
            message: error.message || 'Unknown error occurred',
            details: 'An unexpected error occurred while processing your request.'
        });
    }
}

module.exports = { analyzeReport };