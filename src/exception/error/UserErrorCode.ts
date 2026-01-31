import { HttpStatus } from '@nestjs/common';

export enum UserErrorCode {
  USERNAME_MISSING = 'USER_ERR_001',
  USERNAME_TOO_SHORT = 'USER_ERR_002',
  USERNAME_TOO_LONG = 'USER_ERR_003',
  USERNAME_INVALID_FORMAT = 'USER_ERR_004',
  PASSWORD_MISSING = 'USER_ERR_005',
  PASSWORD_TOO_WEAK = 'USER_ERR_006',
  INVALID_CREDENTIALS = 'USER_ERR_007',
  USER_NOT_FOUND = 'USER_ERR_008',
  INVALID_INPUT = 'USER_ERR_009',
  USER_ALREADY_EXISTS = 'USER_ERR_010',
}

export const USER_ERROR_MESSAGES: Record<
  UserErrorCode,
  { message: string; statusCode: HttpStatus }
> = {
  [UserErrorCode.USERNAME_MISSING]: {
    message: 'Username is required',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.USERNAME_TOO_SHORT]: {
    message: 'Username must be at least 3 characters long',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.USERNAME_TOO_LONG]: {
    message: 'Username must not exceed 20 characters',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.USERNAME_INVALID_FORMAT]: {
    message: 'Username can only contain letters, numbers, and underscores',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.PASSWORD_MISSING]: {
    message: 'Password is required',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.PASSWORD_TOO_WEAK]: {
    message:
      'Password must have at least 8 characters, including uppercase, lowercase, number, and special character',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.INVALID_CREDENTIALS]: {
    message: 'Invalid username or password',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [UserErrorCode.USER_NOT_FOUND]: {
    message: 'User not found',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [UserErrorCode.INVALID_INPUT]: {
    message: 'Invalid input provided',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [UserErrorCode.USER_ALREADY_EXISTS]: {
    message: 'Username already taken',
    statusCode: HttpStatus.CONFLICT,
  },
};
