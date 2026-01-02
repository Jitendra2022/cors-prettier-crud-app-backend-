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
  phone: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      "string.base": "Phone must be text",
      "string.empty": "Phone number is required",
      "string.pattern.base":
        "Phone must be in international format (+1234567890)",
      "any.required": "Phone number is required",
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

// Forgot password validation (email or phone required) with custom messages
const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().messages({
    "string.base": "Email must be a text",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .messages({
      "string.base": "Phone must be text",
      "string.pattern.base":
        "Phone must be in international format (+1234567890)",
    }),
})
  // At least one of email or phone must be provided
  .xor("email", "phone")
  .messages({
    "object.missing": "Either email or phone is required",
    "object.xor": "Provide either email or phone, not both",
  });

// Verify OTP validation (email or phone + OTP) with custom messages
const verifyOtpValidation = Joi.object({
  email: Joi.string().email().messages({
    "string.base": "Email must be a text",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .messages({
      "string.base": "Phone must be text",
      "string.pattern.base":
        "Phone must be in international format (+1234567890)",
    }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.base": "OTP must be text",
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
})
  // At least one of email or phone must be provided
  .xor("email", "phone")
  .messages({
    "object.missing": "Either email or phone is required",
    "object.xor": "Provide either email or phone, not both",
  });

// Reset password validation (email or phone + new password) with custom messages
const resetPasswordValidation = Joi.object({
  email: Joi.string().email().messages({
    "string.base": "Email must be a text",
    "string.email": "Please provide a valid email address",
  }),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .messages({
      "string.base": "Phone must be text",
      "string.pattern.base":
        "Phone must be in international format (+1234567890)",
    }),

  newPassword: Joi.string().min(6).max(128).required().messages({
    "string.base": "Password must be a text",
    "string.empty": "New password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must not exceed 128 characters",
    "any.required": "New password is required",
  }),
})
  // At least one of email or phone must be provided
  .xor("email", "phone")
  .messages({
    "object.missing": "Either email or phone is required",
    "object.xor": "Provide either email or phone, not both",
  });
export {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyOtpValidation,
  resetPasswordValidation,
};
