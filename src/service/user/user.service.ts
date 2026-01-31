import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
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
    private jwtService: JwtService,
  ) {}

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
    const createdUser = await this.userRepository.create(
      userWithHashedPassword,
    );

    const payload = { sub: createdUser._id, username: createdUser.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async login(createUserDto: CreateUserDto): Promise<User | string> {
    const user = await this.userRepository.findByCredentials(
      createUserDto.username,
    );
    if (!user) return 'Invalid credentials';

    const isPasswordValid = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );
    return isPasswordValid ? user : 'Invalid credentials';
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
