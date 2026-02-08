import { HttpStatus } from '@nestjs/common';

export enum GeneralErrorCode {
  GENERAL_ERROR = 'ERR_001',
}

export const GENERAL_ERROR_MESSAGES: Record<
  GeneralErrorCode,
  { message: string; statusCode: HttpStatus }
> = {
  [GeneralErrorCode.GENERAL_ERROR]: {
    message: 'An unexpected error occurred',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};
