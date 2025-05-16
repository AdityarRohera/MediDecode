const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },
  userId : {
    type : String,
    required : true,
    unique : true
  },

// reportCount : {type:Number},

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userModel =  mongoose.model('User', userSchema);
module.exports = {userModel};