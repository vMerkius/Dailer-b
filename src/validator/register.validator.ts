import { Injectable } from '@nestjs/common';
import { UserErrorCode } from '../exception/error/UserErrorCode';
import { error } from 'console';

export interface IValidationError {
  field: string;
  code: UserErrorCode;
}

export interface IRegistrationData {
  username: string;
  password: string;
}

@Injectable()
export class RegisterValidator {
  validateRegistration(
    data: IRegistrationData,
    isUsernameTaken: boolean | null = null,
  ): IValidationError[] {
    const errors: IValidationError[] = [];

    this.validateUsername(data.username, errors, isUsernameTaken);
    this.validatePassword(data.password, errors);

    return errors;
  }

  validateUsername(
    username: string,
    errors: IValidationError[],
    isUsernameTaken?: boolean | null,
  ): void {
    if (isUsernameTaken) {
      errors.push({
        field: 'username',
        code: UserErrorCode.USER_ALREADY_EXISTS,
      });
    }
    if (!username || username.trim() === '') {
      errors.push({
        field: 'username',
        code: UserErrorCode.MISSING_USERNAME,
      });
    } else if (username.length < 3) {
      errors.push({
        field: 'username',
        code: UserErrorCode.USERNAME_TOO_SHORT,
      });
    }
  }

  validatePassword(password: string, errors: IValidationError[]): void {
    if (!password || password.trim() === '') {
      errors.push({
        field: 'password',
        code: UserErrorCode.MISSING_PASSWORD,
      });
    } else if (password.length < 6) {
      errors.push({
        field: 'password',
        code: UserErrorCode.PASSWORD_TOO_SHORT,
      });
    }
  }
}
