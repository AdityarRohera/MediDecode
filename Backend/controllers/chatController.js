const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;
const {chatModel} = require('../models/chatModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {reportModel} = require('../models/reportModel')

    async function getAIResponse(chatHistory, newMessage, basePrompt) {
            let fullPrompt = basePrompt;
          
            chatHistory.forEach(({ role, content }) => {
              fullPrompt += `\n${role === "user" ? "User" : "AI Doctor"}: ${content}`;
            });
          
            fullPrompt += `\nUser: ${newMessage}\nDoctor:`;
          
            const result = await model.generateContent(fullPrompt);
            return await result.response.text();
          }

const chatHandler = async(req , res) => {
    try{

        // first store user id
        const userId = "f2c7433f-1afc-497c-8356-1fb09e4ed359"
        const reportId = req.body;
        const {newMessage} = req.body;

         const findUserReport = await reportModel.findOne({reportId: reportId});
         if(!findUserReport){
            res.send({
                mwessage : "report not found for this user"
            })
         }

         // if user report found than extract  user report summary
         const organsDetail = findUserReport;
         console.log("organDetails -> " , organsDetail);

           const reportSummary = {
           reportId,
           organsSummary: organs.map(({ organ, status, explanation, extractionFromReport }) => ({
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
          You are a helpful AI doctor. This is the user's medical report:
          ${JSON.stringify(reportSummary, null, 2)}
          
          Have a friendly, helpful conversation with the user based on this report.
          Respond clearly in simple language.
          `;

          
          // Build the full conversation as a prompt
          let fullPrompt = basePrompt;

          // now get chatHistory
          const chatHistory = await chatModel.findOne({userId:userId , reportId:reportId});
        //   if(!chatHistory){
        //         res.send({
        //              message :"Chats not found for this user report"
        //         })
        //   }

        const aireply = await getAIResponse(chatHistory , newMessage , basePrompt);

          // chats found
        chatHistory.messages.push(
        { sender: "user", message: newMessage },
        { sender: "ai", message: aireply }
      );
      await chatHistory.save();

        return res.status(200).send({
            status : true,
            reply : aireply
        })
          


    } catch(err){
        console.log(err);
    }
}

module.exports = {chatHandler};