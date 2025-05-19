const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;
const {chatModel} = require('../models/chatModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {reportModel} = require('../models/reportModel')

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    async function getAIResponse(chatHistory, newMessage, basePrompt) {
            let fullPrompt = basePrompt;

          
            chatHistory && chatHistory.forEach(({ role, content }) => {
              fullPrompt += `\n${role === "user" ? "User" : "AI Doctor"}: ${content}`;
            });

            fullPrompt += `in continution to the above chat, user has asked the following question: `
          
            fullPrompt += `\nUser: ${newMessage}\n`;

            console.log("fullPrompt -> ", fullPrompt);
          
            const result = await model.generateContent(fullPrompt);
            return result.response.text();
          }

const chatHandler = async(req , res) => {
    try{
        // first store user id
        const userId = "f2c7433f-1afc-497c-8356-1fb09e4ed359"
        const { reportId, newMessage } = req.body;

        if (!reportId || !newMessage) {
            return res.status(400).send({
                status: false,
                message: "reportId and newMessage are required"
            });
        }

        const findUserReport = await reportModel.findOne({reportId: reportId});
        if(!findUserReport){
            return res.status(404).send({
                status: false,
                message: "report not found for this user"
            });
        }

        // if user report found than extract  user report summary
        const organsDetail = findUserReport.organs;
        console.log("organDetails -> " , organsDetail);

        const reportSummary = {
            reportId,
            organsSummary: organsDetail.map(({ organ, status, explanation, extractionFromReport }) => ({
                organ,
                status,
                explanation,
                testName: extractionFromReport.testName,
                resultValue: extractionFromReport.resultValue,
                expectedRange: extractionFromReport.expectedRange,
                unit: extractionFromReport.unitOfMeasurement
            }))
        };

        console.log(reportSummary);

        const basePrompt = `
        You are a helpful AI doctor, patient will be asking you about their medical report. This is the user's medical report:
        ${JSON.stringify(reportSummary, null, 2)}
        
        Have a friendly, helpful conversation with the user based on this report in short, to the point and concise manner.
        Respond clearly in simple language.
        `;

        // now get chatHistory
        let chatHistory = await chatModel.findOne({userId: userId, reportId: reportId});
        // if(!chatHistory){
        //     return res.status(404).send({
        //         status: false,
        //         message: "Chats not found for this user report"
        //     });
        // }

        const aireply = await getAIResponse(chatHistory ? chatHistory.messages : [], newMessage, basePrompt);

        if(!chatHistory){
            chatHistory = new chatModel({
                userId: userId,
                reportId: reportId,
                messages: []
            });
        }
        // chats found
        chatHistory.messages.push(
            { role: "user", content: newMessage }, 
            { role: "ai", content: aireply }
        );
        const savedChatHistory = await chatHistory.save();
        console.log("savedChatHistory -> ", savedChatHistory);

        return res.status(200).send({
            status: true,
            reply: aireply
        });

    } catch(err){
        console.log(err);
        return res.status(500).send({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}



module.exports = {chatHandler};