const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  fileName: String,
  uploadDate: { type: Date, default: Date.now },
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

const reportModel = mongoose.model('Report', reportSchema);
module.exports = {reportModel};
