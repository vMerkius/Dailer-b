import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  UserErrorCode,
  USER_ERROR_MESSAGES,
  GeneralErrorCode,
  GENERAL_ERROR_MESSAGES,
} from '../exception/error';

type ErrorCode = UserErrorCode | GeneralErrorCode;

@Injectable()
export class MessageResourceConfig {
  private messages: Map<string, string> = new Map();

  constructor() {
    this.loadMessages();
  }

  private loadMessages(): void {
    try {
      const filePath = path.join(
        process.cwd(),
        'src/config/error-messages.properties',
      );
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      fileContent.split('\n').forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, value] = trimmedLine.split('=');
          if (key && value) {
            this.messages.set(key.trim(), value.trim());
          }
        }
      });
    } catch (error) {
      console.error(
        'Failed to load error messages from properties file:',
        error,
      );
    }
  }

  getErrorMessage(errorCode: ErrorCode) {
    const messageText =
      this.messages.get(errorCode) ||
      this.messages.get(GeneralErrorCode.GENERAL_ERROR) ||
      'An unexpected error occurred';

    const errorConfig =
      USER_ERROR_MESSAGES[errorCode as UserErrorCode] ||
      GENERAL_ERROR_MESSAGES[errorCode as GeneralErrorCode];

    return {
      message: messageText,
      statusCode: errorConfig?.statusCode || 500,
    };
  }

  getMessage(errorCode: ErrorCode): string {
    return this.getErrorMessage(errorCode).message;
  }

  getStatusCode(errorCode: ErrorCode): number {
    return this.getErrorMessage(errorCode).statusCode;
  }
}
