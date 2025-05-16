const express = require('express');
const router = express.Router();
const {loginOrRegister} = require('../controllers/userController')
const {chatHandler} = require('../controllers/chatController')

router.post('/auth', loginOrRegister);
router.post('/chat-with-ai-doctor' , chatHandler)

module.exports = {router};
