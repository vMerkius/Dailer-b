import { UserErrorCode } from '../exception/error/UserErrorCode';

export type ValidationErrorCode = UserErrorCode;

export interface IValidationError {
  field: string;
  code: ValidationErrorCode;
}
