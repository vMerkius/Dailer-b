import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(createUserDto);
  }

  async login(createUserDto: CreateUserDto): Promise<User | string> {
    const user = await this.userRepository.findByCredentials(
      createUserDto.username,
      createUserDto.password,
    );
    return user || 'User not found';
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
