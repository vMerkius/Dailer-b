import { Injectable } from '@nestjs/common';
import { IValidationError } from '../../types';
import { UserErrorCode } from 'src/exception/error';

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
        code: UserErrorCode.USERNAME_MISSING,
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
        code: UserErrorCode.PASSWORD_MISSING,
      });
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordRegex.test(password) === false) {
      errors.push({
        field: 'password',
        code: UserErrorCode.PASSWORD_TOO_WEAK,
      });
    }
  }
}
