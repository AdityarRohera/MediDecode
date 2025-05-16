const express = require('express');
const chatRouter = express.Router();
const {chatHandler} = require('../controllers/chatController')

chatRouter.post('/chat-with-ai-doctor' , chatHandler)

module.exports = {chatRouter};