import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { IHttpError } from 'interfaces';

/**
 * Global error handler.
 */
export const errorHandler: ErrorRequestHandler = (
  err: IHttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get code
  const { code: errorCode, message, hint, status } = err || {};

  // Default status code
  let statusCode = 500;

  // switch on errorCode property
  switch (errorCode) {
    // Postgres codes
    case 'P0001':
      statusCode = 400;
      break;
    case '22P02':
      statusCode = 400;
      break;
    case '23505':
      statusCode = 400;
      break;
    case '42501':
    case '23000':
      statusCode = 403;
      break;
    case '42883':
      statusCode = 404;
      break;
  }

  // return json
  return res.status(status || statusCode).json({ message, hint, errorCode });
};
