const express = require('express');
const router = express.Router();
const {loginOrRegister} = require('../controllers/userController')
const {chatHandler} = require('../controllers/chatController');
const { getHistory } = require('../controllers/reportController');

router.post('/auth', loginOrRegister);
router.post('/chat-with-ai-doctor' , chatHandler)
router.get('/history' , getHistory)

module.exports = {router};
