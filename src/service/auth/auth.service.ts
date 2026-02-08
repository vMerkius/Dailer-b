import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { UserRepository } from 'src/repository';
import { LoginValidator, RegisterValidator } from 'src/validator';
import { IAuthResponse, IValidationError } from 'src/types';
import { MessageResourceConfig } from '../../config/MessageResourceConfig';
import { UserErrorCode } from 'src/exception/error';
import { RegisterUserDto, LoginUserDto } from 'src/integration';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private registerValidator: RegisterValidator,
    private loginValidator: LoginValidator,
    private messageResourceConfig: MessageResourceConfig,
    private jwtService: JwtService,
  ) {}

  private readonly ACCESS_TOKEN_MAX_AGE = parseInt(
    process.env.ACCESS_TOKEN_EXPIRES_IN ?? '86400',
    10,
  );
  private readonly REFRESH_TOKEN_MAX_AGE = parseInt(
    process.env.REFRESH_TOKEN_EXPIRES_IN ?? '2592000',
    10,
  );

  private throwValidationError(
    code: UserErrorCode,
    errors: IValidationError[],
  ): never {
    throw new BadRequestException({
      code,
      message: this.messageResourceConfig.getMessage(code),
      errors,
      statusCode: this.messageResourceConfig.getStatusCode(code),
    });
  }

  private throwUnauthorizedError(code: UserErrorCode): never {
    throw new UnauthorizedException({
      code,
      message: this.messageResourceConfig.getMessage(code),
      statusCode: this.messageResourceConfig.getStatusCode(code),
    });
  }

  async register(registerUserDto: RegisterUserDto): Promise<IAuthResponse> {
    const existingUser = await this.userRepository.findByUsername(
      registerUserDto.username,
    );
    const isUsernameTaken = !!existingUser;
    const validationErrors: IValidationError[] =
      this.registerValidator.validateRegistration(
        registerUserDto,
        isUsernameTaken,
      );

    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];
      return this.throwValidationError(firstError.code, validationErrors);
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      registerUserDto.password,
      saltOrRounds,
    );

    const userWithHashedPassword = {
      ...registerUserDto,
      password: hashedPassword,
    };
    const createdUser = await this.userRepository.create(
      userWithHashedPassword,
    );

    const payload = { sub: createdUser._id, username: createdUser.username };
    return this.generateTokens(payload);
  }

  async login(loginUserDto: LoginUserDto): Promise<IAuthResponse> {
    const validationErrors: IValidationError[] =
      this.loginValidator.validateLogin(loginUserDto);

    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];
      return this.throwValidationError(firstError.code, validationErrors);
    }

    const user = await this.userRepository.findByUsername(
      loginUserDto.username,
    );

    if (!user) {
      return this.throwUnauthorizedError(UserErrorCode.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      return this.throwUnauthorizedError(UserErrorCode.INVALID_CREDENTIALS);
    }

    const payload = { sub: user._id, username: user.username };

    return this.generateTokens(payload);
  }

  private async generateTokens(payload: {
    sub: Types.ObjectId;
    username: string;
  }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.ACCESS_TOKEN_MAX_AGE,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.REFRESH_TOKEN_MAX_AGE,
    });
    const expiresIn = this.ACCESS_TOKEN_MAX_AGE;
    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }
}
