import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateRegister = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const validateAssetCreation = [
  body('name')
    .notEmpty().withMessage('Asset name is required')
    .isLength({ min: 2 }).withMessage('Asset name must be at least 2 characters long'),
  body('type')
    .notEmpty().withMessage('Asset type is required')
    .isIn(['real_estate', 'stock', 'cryptocurrency', 'vehicle', 'other'])
    .withMessage('Invalid asset type'),
  body('value')
    .notEmpty().withMessage('Asset value is required')
    .isNumeric().withMessage('Asset value must be a number')
    .custom((value) => value >= 0).withMessage('Asset value cannot be negative'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  handleValidationErrors,
];

export const validateAssetUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2 }).withMessage('Asset name must be at least 2 characters long'),
  body('type')
    .optional()
    .isIn(['real_estate', 'stock', 'cryptocurrency', 'vehicle', 'other'])
    .withMessage('Invalid asset type'),
  body('value')
    .optional()
    .isNumeric().withMessage('Asset value must be a number')
    .custom((value) => value >= 0).withMessage('Asset value cannot be negative'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  handleValidationErrors,
];

export const validateAssetQuery = [
  body('search')
    .optional()
    .isString().withMessage('Search term must be a string'),
  body('type')
    .optional()
    .isIn(['real_estate', 'stock', 'cryptocurrency', 'vehicle', 'other'])
    .withMessage('Invalid asset type'),
  body('minValue')
    .optional()
    .isNumeric().withMessage('Minimum value must be a number'),
  body('maxValue')
    .optional()
    .isNumeric().withMessage('Maximum value must be a number'),
  body('sortBy')
    .optional()
    .isIn(['name', 'type', 'value', 'createdAt'])
    .withMessage('Invalid sort field'),
  body('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be "asc" or "desc"'),
  handleValidationErrors,
];