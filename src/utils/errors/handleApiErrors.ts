import { ErrorResponse } from '@/lib/errorResponse';
import { JWTExpired, JWTInvalid } from 'jose/errors';
import { ZodError } from 'zod';

export const handleApiErrors = (error: unknown) => {
  if (error instanceof ZodError) {
    return ErrorResponse({
      message: error.issues[0].message,
      error: error.issues,
      status: 400,
    });
  }

  if (error instanceof JWTExpired) {
    return ErrorResponse({
      message: 'Token expired',
      error: error.message,
    });
  }

  if (error instanceof JWTInvalid) {
    return ErrorResponse({ message: error.message, error });
  }

  if (error instanceof Error) {
    return ErrorResponse({ message: error.message });
  }

  return ErrorResponse({ message: 'Internal Server Error' });
};
