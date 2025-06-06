const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const {router} = require('./routes/userRoute')
const {reportRouter} = require('./routes/reportRoutes')
const {chatRouter} = require('./routes/chatRoute')
const {analysisRouter} = require('./routes/analysisRoute')
app.use('/api/v1/user', router);
app.use('/api/v1/report', reportRouter);
app.use('/api/v1' , chatRouter);
app.use('/api/v1' , analysisRouter)

// db connect here
const dbConnect = require('./database/dbConnect');
dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 