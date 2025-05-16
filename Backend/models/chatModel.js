const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
   userId: { type: String, required: true},
  reportId :{ type: String, required: true},
   messages: [
    {
      role: { type: String, enum: ['user', 'ai'] },
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const chatModel = mongoose.model('Chat', chatSchema);
module.exports = {chatModel};
