import { ErrorResponse } from '@/lib/errorResponse';
import { JWTExpired, JWTInvalid } from 'jose/errors';
import { ZodError } from 'zod';
import { logger } from '../logger';

export const handleApiErrors = (error: unknown) => {
  if (error instanceof ZodError) {
    logger.error({
      type: 'ZodError',
      message: error.issues[0].message,
      error: error,
    });
    return ErrorResponse({
      message: error.issues[0].message,
      error: error.issues,
      status: 400,
    });
  }

  if (error instanceof JWTExpired) {
    logger.error({ type: 'JWTExpired', message: 'Token expired', error });
    return ErrorResponse({
      message: 'Token expired',
      error: error.message,
    });
  }

  if (error instanceof JWTInvalid) {
    logger.error({ type: 'JWTInvalid', message: 'Token invalid', error });
    return ErrorResponse({ message: error.message, error });
  }

  if (error instanceof Error) {
    logger.error({ type: 'Error', message: error.message, error });
    return ErrorResponse({ message: error.message });
  }
  logger.error({ type: 'UnknownError', message: 'Internal Server Error', error });
  return ErrorResponse({ message: 'Internal Server Error' });
};
