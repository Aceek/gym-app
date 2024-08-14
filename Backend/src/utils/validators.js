import { body, query } from "express-validator";

export const validateEmail = () => {
  return body("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail();
};

export const validatePasswordRegister = () => {
  return body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain a special character")
    .trim();
};

export const validatePasswordLogin = () => {
  return body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .trim();
};

export const validateDisplayName = () => {
  return body("displayName")
    .notEmpty()
    .withMessage("Display name is required")
    .trim()
    .escape();
};

export const validateToken = () => {
  return query("token")
    .notEmpty()
    .withMessage("Token is required")
    .isString()
    .withMessage("Token must be a valid string");
};