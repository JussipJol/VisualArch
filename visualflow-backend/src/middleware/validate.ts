import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const FORBIDDEN_PASSWORDS = ['qwerty', '123456', '12345678', 'password', 'admin', 'welcome1'];
const FORBIDDEN_NAMES = ['admin', 'root', 'support', 'staff', 'moderator', 'test', 'flactuation', 'visualarch'];
const OFFENSIVE_TERMS = ['fuck', 'shit', 'asshole', 'bastard', 'bitch']; // Basic list for demo

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }
  next();
};

export const registerValidation = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('name')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .custom((value) => {
      const lower = value.toLowerCase();
      if (FORBIDDEN_NAMES.some(name => lower.includes(name))) {
        throw new Error('This name is reserved or not allowed');
      }
      if (OFFENSIVE_TERMS.some(term => lower.includes(term))) {
        throw new Error('Name contains offensive language');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
    .custom((value) => {
      if (FORBIDDEN_PASSWORDS.includes(value.toLowerCase())) {
        throw new Error('This password is too simple and insecure');
      }
      return true;
    }),
];
