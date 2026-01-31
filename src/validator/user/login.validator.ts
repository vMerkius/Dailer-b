import { Injectable } from '@nestjs/common';
import { UserErrorCode } from '../../exception/error/UserErrorCode';

export interface IValidationError {
  field: string;
  code: UserErrorCode;
}

export interface ILoginData {
  username: string;
  password: string;
}

@Injectable()
export class LoginValidator {
  validateLogin(data: ILoginData): IValidationError[] {
    const errors: IValidationError[] = [];
    this.validateUsername(data.username, errors);
    this.validatePassword(data.password, errors);
    return errors;
  }

  validateUsername(username: string, errors: IValidationError[]): void {
    if (!username || username.trim() === '') {
      errors.push({
        field: 'username',
        code: UserErrorCode.USERNAME_MISSING,
      });
    }
  }

  validatePassword(password: string, errors: IValidationError[]): void {
    if (!password || password.trim() === '') {
      errors.push({
        field: 'password',
        code: UserErrorCode.PASSWORD_MISSING,
      });
    }
  }

  validateCredentials(
    username: string,
    password: string,
    userExists: boolean,
  ): IValidationError[] {
    const errors: IValidationError[] = [];

    if (!userExists) {
      errors.push({
        field: 'username',
        code: UserErrorCode.INVALID_CREDENTIALS,
      });
      return errors;
    }

    return errors;
  }
}
