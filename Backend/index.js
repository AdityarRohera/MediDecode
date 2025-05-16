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
app.use('/api/v1/user', router);

// db connect here
const dbConnect = require('./Database/dbConnect');
dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 