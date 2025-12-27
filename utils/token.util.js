import jwt from "jsonwebtoken";

/**
 * Generate JWT Access Token
 * @param {Object} payload - e.g., { _id: user._id }
 * @returns {String} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN, // e.g., '15m'
  });
};

/**
 * Generate JWT Refresh Token
 * @param {Object} payload - e.g., { _id: user._id }
 * @returns {String} JWT token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, // e.g., '7d'
  });
};

export { generateAccessToken, generateRefreshToken };
