import { Injectable } from '@nestjs/common';
import { IValidationError } from '../../types';
import { UserErrorCode } from 'src/exception/error';

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
}
