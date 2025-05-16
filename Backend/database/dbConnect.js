const mongoose = require('mongoose');
const URL = process.env.DATABASE_URL;

dbConnect = async () => {
   try{
         const dbConnect = await mongoose.connect(URL);
         if(dbConnect){
            console.log("db connect successfully");
         }
   }catch(err){
        console.log("error in connecting database");
   }
}

module.exports = dbConnect;