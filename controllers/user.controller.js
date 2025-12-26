import User from "../models/user.model.js";
import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import jwt from "jsonwebtoken";
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }
    const hashed = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashed,
    });
    res.status(201).json({
      success: true,
      message: "registration successfully!",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await comparePassword(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid or wrong password",
      });
    }
    // Generate access token
    const accessToken = jwt.sign(
      { _id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: existingUser,
      accessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err.message,
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};
const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};
export { register, login, getUsers, getUserById, deleteUserById };
