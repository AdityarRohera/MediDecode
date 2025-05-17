const mongoose = require('mongoose');

const testComparisonSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  organ: { type: String },
  change: {
    type: String,
    enum: ["Improved", "Declined", "Same"],
    required: true
  },
  oldValue: { type: String, required: true },
  newValue: { type: String, required: true },
  expectedRange: { type: String },
  statusNow: {
    type: String,
    enum: ["Normal", "Borderline", "Critical"]
  },
  feedback: { type: String, required: true }
});

const reportComparisonSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // UUID instead of ObjectId
  reportId1: { type: String, required: true },
  reportId2: { type: String, required: true },
  analysisId : {type: String , required: true},
  comparedAt: { type: Date, default: Date.now },
  testsCompared: [testComparisonSchema]
});

module.exports = mongoose.model("ReportComparison", reportComparisonSchema);