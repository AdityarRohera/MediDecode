const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  fileName: String,
  uploadDate: { type: Date, default: Date.now },
  reportId: String,
  fileUrl: String,
  summary: {
    normal: Number,
    borderline: Number,
    critical: Number,
  },
  organs: [
    {
      organ: String, 
      status: String, 
      explanation: String,
      extractionFromReport: {
        testName: String,
        resultValue: String,
        expectedRange: String,
        unitOfMeasurement: String
      }   
    }
  ],
});

module.exports = mongoose.model('Report', reportSchema);
