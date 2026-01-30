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
  errors: IValidationError[] = [];
  validateRegistration(data: IRegistrationData): IValidationError[] {
    if (!data.username || data.username.toString().trim() === '') {
      this.errors.push({
        field: 'username',
        code: UserErrorCode.MISSING_USERNAME,
      });
    } else if (data.username.length < 3) {
      this.errors.push({
        field: 'username',
        code: UserErrorCode.USERNAME_TOO_SHORT,
      });
    }

    if (!data.password || data.password.toString().trim() === '') {
      this.errors.push({
        field: 'password',
        code: UserErrorCode.MISSING_PASSWORD,
      });
    } else if (data.password.length < 6) {
      this.errors.push({
        field: 'password',
        code: UserErrorCode.PASSWORD_TOO_SHORT,
      });
    }

    return this.errors;
  }
}
