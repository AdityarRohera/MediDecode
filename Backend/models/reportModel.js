const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  fileName: String,
  uploadDate: { type: Date, default: Date.now },
  summary: {
    normal: Number,
    borderline: Number,
    critical: Number,
  },
  organs: [
    {
      name: String, // e.g., "Kidney Function"
      status: String, // "Normal", "Borderline", "Critical"
      details: Object, // Future extensibility
    }
  ],
});

module.exports = mongoose.model('Report', reportSchema);
