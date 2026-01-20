import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  register(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This action register a new user';
  }

  login(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This action logs in a user';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
