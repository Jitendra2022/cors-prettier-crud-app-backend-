import User from "../models/user.model.js";
import { hashPassword } from "../utils/password.util.js";
import isValidObjectId from "../utils/validateObjectId.util.js";
import { registerValidation } from "../validation/user.validation.js";

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
        message: "Invalid user ID!",
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
      message: "Something went wrong!",
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
        message: "Invalid user ID!",
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
      message: "User deleted successfully!",
      user: deletedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err.message,
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // 1️⃣ Validate user ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID!",
      });
    }
    // 2️⃣ Validate incoming data
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { name, email, password } = req.body;

    // 3️⃣ Find existing user by ID
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // 4️⃣ Check if email is changed and already exists
    if (existingUser.email !== email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use!",
        });
      }
    }
    // 5️⃣ Hash new password
    const hashed = await hashPassword(password);
    // 6️⃣ Update user in the database
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

export { getUsers, getUserById, deleteUserById, updateUserById };
