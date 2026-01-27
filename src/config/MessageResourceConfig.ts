import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  UserErrorCode,
  USER_ERROR_MESSAGES,
} from '../exception/error/UserErrorCode';

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
      console.log('Loading error messages from:', filePath);
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
      console.log('Messages map:', this.messages);
    } catch (error) {
      console.error(
        'Failed to load error messages from properties file:',
        error,
      );
    }
  }

  getErrorMessage(errorCode: UserErrorCode) {
    const messageText =
      this.messages.get(errorCode) || 'An unexpected error occurred';
    const errorConfig = USER_ERROR_MESSAGES[errorCode];

    return {
      message: messageText,
      statusCode: errorConfig?.statusCode || 500,
    };
  }

  getMessage(errorCode: UserErrorCode): string {
    return this.getErrorMessage(errorCode).message;
  }

  getStatusCode(errorCode: UserErrorCode): number {
    return this.getErrorMessage(errorCode).statusCode;
  }
}
