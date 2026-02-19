import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError, ValidationError, UnauthorizedError } from '../types/errors';

interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// Express error handlers require all 4 parameters to be recognized
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  console.error(`[Error] ${err.name}: ${err.message}`);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: 'VALIDATION_ERROR',
        details: err.errors,
      },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.name.toUpperCase().replace('ERROR', '_ERROR'),
      },
    });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({
      error: {
        message: "Unauthorized user",
        code: "UNAUTHORIZED_ERROR"
      }
    });
    return;
  }

  // Unknown error
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    },
  });
};
