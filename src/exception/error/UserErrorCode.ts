import { HttpStatus } from '@nestjs/common';

export enum UserErrorCode {
  USER_ALREADY_EXISTS = 'USER_001',
  INVALID_CREDENTIALS = 'USER_002',
  USER_NOT_FOUND = 'USER_003',
  INVALID_INPUT = 'USER_004',
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
};
