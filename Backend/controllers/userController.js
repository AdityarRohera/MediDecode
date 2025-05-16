const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {userModel} = require('../models/userModel')

const secret_key = process.env.JWT_SECRET || 'your_default_secret';

async function loginOrRegister(req, res) {
  try {
    const { name, email, password} = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ status: "fail", message: "Name, Email, and Password are required" });
    }

    let user = await userModel.findOne({ email });

    // If user doesn't exist, create new
    if (!user) {
      user = await userModel.create({
        name,
        email,
        password,
        userId: uuidv4()
      });

      const token = jwt.sign({ userID: user._id }, secret_key);

      return res.status(201).json({
        status: "success",
        message: "User registered successfully",
        token
      });
    }

    // If user exists, validate password
    if (user.password !== password) {
      return res.status(401).json({ status: "fail", message: "Invalid password" });
    }

    const token = jwt.sign({ userID: user._id }, secret_key);

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token
    });

  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong",
      error: err.message
    });
  }
}

module.exports = { loginOrRegister };