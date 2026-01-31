import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../integration/user/dto/create-user.dto';
import { User } from '../../model';
import { UserRepository } from 'src/repository';
import { RegisterValidator } from '../../validator';
import { MessageResourceConfig } from '../../config/MessageResourceConfig';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private registerValidator: RegisterValidator,
    private messageResourceConfig: MessageResourceConfig,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
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
      const errorMessage = this.messageResourceConfig.getMessage(
        firstError.code,
      );
      const statusCode = this.messageResourceConfig.getStatusCode(
        firstError.code,
      );
      throw new BadRequestException({
        code: firstError.code,
        message: errorMessage,
        errors: validationErrors,
        statusCode: statusCode,
      });
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
    return await this.userRepository.create(userWithHashedPassword);
  }

  async login(createUserDto: CreateUserDto): Promise<User | string> {
    const user = await this.userRepository.findByCredentials(
      createUserDto.username,
    );
    if (!user) return 'Invalid credentials';

    const isPasswordValid = await bcrypt.compare(user.password, user.password);
    return isPasswordValid ? user : 'Invalid credentials';
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
