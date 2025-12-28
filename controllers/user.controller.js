import User from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import jwt from "jsonwebtoken";
import isValidObjectId from "../utils/validateObjectId.util.js";
import {
  registerValidation,
  loginValidation,
} from "../validation/user.validation.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.util.js";
const register = async (req, res) => {
  try {
    // 1️⃣ Validate incoming data
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { name, email, password } = req.body;
    // 2️⃣ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }
    // 3️⃣ Hash password
    const hashed = await hashPassword(password);
    // 4️⃣ Create user
    const newUser = await User.create({
      name,
      email,
      password: hashed,
    });
    res.status(201).json({
      success: true,
      message: "Registration successfully!",
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
    // 1️⃣ Validate incoming data
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    // 2️⃣ Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }
    // 3️⃣ Compare password
    const isMatch = await comparePassword(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid or wrong password",
      });
    }
    // Access token (short-lived)
    const accessToken = generateAccessToken({
      _id: existingUser._id,
      role: existingUser.role,
    });
    // Refresh token (long-lived)
    const refreshToken = generateRefreshToken({
      _id: existingUser._id,
      role: existingUser.role,
    });
    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    // Save tokens in cookies
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: existingUser,
      accessToken,
      refreshToken,
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
const logout = async (req, res) => {
  try {
    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    // Clear refresh token cookie
    res.clearCookie("refreshToken", cookieOptions);

    // Clear access token cookie (optional but recommended)
    res.clearCookie("accessToken", cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged out successfully!",
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

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "NO refresh token provided ",
      });
    }
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    // Find user by ID from token
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Generate new access token
    const newAccessToken = generateAccessToken({
      _id: user._id,
      role: user.role,
    });
    res.status(200).json({
      success: true,
      user,
      accessToken: newAccessToken,
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
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
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
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
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

const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // 1️⃣ Find existing user
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // 2️⃣ Check email only if changed
    if (existingUser.email !== email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use!",
        });
      }
    }
    const hashed = await hashPassword(password);
    // 3️⃣ Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password: hashed },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export {
  register,
  login,
  getUsers,
  getUserById,
  deleteUserById,
  updateById,
  refreshToken,
  logout,
};
