const mongoose = require('mongoose');
const URL = process.env.DATABASE_URL;
console.log(URL);

dbConnect = async () => {
   try{
         const dbConnect = await mongoose.connect(URL , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         });
         if(dbConnect){
            console.log("db connect successfully");
         }
   }catch(err){
        console.log("error in connecting database");
   }
}

module.exports = dbConnect;