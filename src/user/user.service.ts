import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(createUserDto: CreateUserDto): Promise<User | string> {
    const isUsernameTaken = await this.userRepository.findByCredentials(
      createUserDto.username,
    );
    if (isUsernameTaken) {
      return 'Username already taken';
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
