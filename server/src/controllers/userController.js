import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "User not found" });

      if (!user.password) return res.status(400).json({ message: "This user has no password set, use Google sign-in" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const googleSignIn = async (req, res) => {
//   try {
//     const { tokenId } = req.body;
//     const ticket = await client.verifyIdToken({
//       idToken: tokenId,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { name, email, sub: googleId } = ticket.getPayload();

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({ name, email, googleId });
//     }

//     const token = generateToken(user._id);
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Google sign-in failed", error: error.message });
//   }
// };
