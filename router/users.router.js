import express from "express";
import { createUsers, getUserByName } from "../service/users.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export default router;
