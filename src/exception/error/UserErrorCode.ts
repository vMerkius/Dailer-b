import { HttpStatus } from '@nestjs/common';

export enum UserErrorCode {
  USER_ALREADY_EXISTS = 'USER_001',
  INVALID_CREDENTIALS = 'USER_002',
  USER_NOT_FOUND = 'USER_003',
  INVALID_INPUT = 'USER_004',
  MISSING_USERNAME = 'USER_005',
  MISSING_PASSWORD = 'USER_006',
  PASSWORD_TOO_SHORT = 'USER_007',
  USERNAME_TOO_SHORT = 'USER_008',
}

export const USER_ERROR_MESSAGES: Record<
  UserErrorCode,
  { message: string; statusCode: HttpStatus }
> = {
  [UserErrorCode.USER_ALREADY_EXISTS]: {
    message: 'Username already taken',
    statusCode: HttpStatus.CONFLICT,
  },
  [UserErrorCode.INVALID_CREDENTIALS]: {
    message: 'Invalid credentials',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [UserErrorCode.USER_NOT_FOUND]: {
    message: 'User not found',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [UserErrorCode.INVALID_INPUT]: {
    message: 'Invalid input',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.MISSING_USERNAME]: {
    message: 'Username is required',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.MISSING_PASSWORD]: {
    message: 'Password is required',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.PASSWORD_TOO_SHORT]: {
    message: 'Password must be at least 6 characters long',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.USERNAME_TOO_SHORT]: {
    message: 'Username must be at least 3 characters long',
    statusCode: HttpStatus.BAD_REQUEST,
  },
};
