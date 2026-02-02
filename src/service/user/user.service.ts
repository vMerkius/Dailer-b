import { Injectable } from '@nestjs/common';
import { User } from 'src/model';
import { UserRepository } from 'src/repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
