import express from "express";
import { createUsers, getUserByName, updateUser } from "../service/users.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import * as dotenv from 'dotenv'
dotenv.config();
import { client } from "../index.js";


const router = express.Router();

async function generateHashedPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

router.post("/signup", async function (request, response) {
  try {
    const { username, password } = request.body;

    const userFromDB = await getUserByName(username);

    if (userFromDB) {
      return response.status(401).json({ message: "Username Already Exists" });
    }

    if (password.length < 8) {
      return response.status(401).json({ message: "Password must be at least 8 characters long" });
    }

    const hashedPassword = await generateHashedPassword(password);
    const result = await createUsers({
      username: username,
      password: hashedPassword,
    });

    response.status(201).json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async function (request, response) {
  try {
    const { username, password } = request.body;
    const userFromDB = await getUserByName(username);

    if (!userFromDB) {
      return response.status(401).json({ message: "Invalid Credentials" });
    }

    const storedDBPassword = userFromDB.password;
    const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);

    if (!isPasswordCheck) {
      return response.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
    response.status(200).json({ message: "Login Successful", token: token });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function generateRandomToken() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(generateRandomToken);

const passwordResetTokens = new Map();

router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  const token = generateRandomToken();
  console.log(token);
  passwordResetTokens.set(username, token);

  const mailOptions = {
    from: process.env.EMAIL,
    to: username,
    subject: 'Password Reset Request',
    text: `Your Token is: ${token}`,
    html: `
    <p>Click the link below to reset your password:</p>
    <p>Your Code is: ${token}</p>
    <p><a href="http://localhost:5173/reset-password">Reset Password</a></p>
    <p>If you didn't request this password reset, you can ignore this email.</p>
  `,
  };
  const user = await client.db("Money-Manger").collection("users").findOne({ username: username });

  if(!user){
    res.status(404).json({ message: 'User Not Found' });
  }else{
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send reset email' });
    }
  }
  
});


router.post('/reset-password', async (req, res) => {

  const { username, token, newPassword } = req.body;

  const tokens = parseInt(req.body.token)
  // Verify that the token matches the one generated earlier
  const storedToken = passwordResetTokens.get(username);

  if (!storedToken || tokens !== storedToken) {
    return res.status(404).json({ message: 'Invalid or expired token' });
  }

  const hashedPassword = await generateHashedPassword(newPassword);
  
  try {
    // Find the user by email in your database
    const user = await client.db("Money-Manger").collection("users").updateOne({ username }, { $set: { password: hashedPassword } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear the token from the map after it's used
    passwordResetTokens.delete(token);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reset password. Please try again later.' });
  }
});


export default router;
