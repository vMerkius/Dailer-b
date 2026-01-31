import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/integration/user/dto/create-user.dto';
import { User } from 'src/model';
import { UserRepository } from 'src/repository';
import { LoginValidator, RegisterValidator } from 'src/validator';
import { MessageResourceConfig } from '../../config/MessageResourceConfig';
import { UserErrorCode } from 'src/exception/error';
import { IValidationError } from 'src/validator/user/register.validator';

@Injectable()
export class UserService {
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
  ) {
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
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const existingUser = await this.userRepository.findByCredentials(
      createUserDto.username,
    );
    const isUsernameTaken = !!existingUser;
    const validationErrors = this.registerValidator.validateRegistration(
      createUserDto,
      isUsernameTaken,
    );

    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];
      this.throwValidationError(firstError.code, validationErrors);
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const userWithHashedPassword = {
      ...createUserDto,
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

  async login(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const validationErrors = this.loginValidator.validateLogin(createUserDto);

    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];
      this.throwValidationError(firstError.code, validationErrors);
    }

    const user = await this.userRepository.findByCredentials(
      createUserDto.username,
    );

    if (!user) {
      this.throwUnauthorizedError(UserErrorCode.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.throwUnauthorizedError(UserErrorCode.INVALID_CREDENTIALS);
    }

    const payload = { sub: user._id, username: user.username };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
