import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/repository';
import { LoginValidator, RegisterValidator } from 'src/validator';
import { IValidationError } from 'src/types';
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

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<{ accessToken: string }> {
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

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
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
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
