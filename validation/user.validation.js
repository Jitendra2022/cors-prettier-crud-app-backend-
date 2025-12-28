import Joi from "joi";

// Registration validation with custom messages
const registerValidation = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a text",
    "string.empty": "Name is required",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should not exceed 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a text",
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.base": "Password must be a text",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must not exceed 128 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("user", "admin").optional().messages({
    "any.only": "Role must be either user or admin",
    "string.base": "Role must be a text",
  }),
});

// Login validation with custom messages
const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a text",
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.base": "Password must be a text",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must not exceed 128 characters",
    "any.required": "Password is required",
  }),
});
export { registerValidation, loginValidation };
