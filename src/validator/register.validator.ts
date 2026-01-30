import { Injectable } from '@nestjs/common';
import { UserErrorCode } from '../exception/error/UserErrorCode';

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
  validateRegistration(data: IRegistrationData): IValidationError[] {
    const errors: IValidationError[] = [];

    if (!data.username || data.username.toString().trim() === '') {
      errors.push({
        field: 'username',
        code: UserErrorCode.MISSING_USERNAME,
      });
    } else if (data.username.length < 3) {
      errors.push({
        field: 'username',
        code: UserErrorCode.USERNAME_TOO_SHORT,
      });
    }

    if (!data.password || data.password.toString().trim() === '') {
      errors.push({
        field: 'password',
        code: UserErrorCode.MISSING_PASSWORD,
      });
    } else if (data.password.length < 6) {
      errors.push({
        field: 'password',
        code: UserErrorCode.PASSWORD_TOO_SHORT,
      });
    }

    return errors;
  }
}
