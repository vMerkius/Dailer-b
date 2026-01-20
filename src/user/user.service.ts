import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async register(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({
      username: createUserDto.username,
      password: createUserDto.password,
    });
    return user || 'User not found';
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }
}
