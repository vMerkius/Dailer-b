import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(data: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(data);
    return await newUser.save();
  }

  async findByCredentials(
    username: string,
    password: string,
  ): Promise<User | null> {
    return await this.userModel.findOne({ username, password });
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      throw new BadRequestException('Invalid user ID');
    }
  }
}
