import { HttpStatus } from '@nestjs/common';

export enum AssistantErrorCode {
  RESPONSE_ERROR = 'ASSISTANT_ERR_001',
  INVALID_INPUT = 'ASSISTANT_ERR_002',
}

export const ASSISTANT_ERROR_MESSAGES: Record<
  AssistantErrorCode,
  { message: string; statusCode: HttpStatus }
> = {
  [AssistantErrorCode.RESPONSE_ERROR]: {
    message: 'Failed to generate response',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [AssistantErrorCode.INVALID_INPUT]: {
    message: 'Invalid input for assistant',
    statusCode: HttpStatus.BAD_REQUEST,
  },
};
