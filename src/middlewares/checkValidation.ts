import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Check express-validation for all end points.
 */
export const checkValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
