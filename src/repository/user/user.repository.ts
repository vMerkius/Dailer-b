import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model';
import { RegisterUserDto } from 'src/integration';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(data: RegisterUserDto): Promise<User> {
    const newUser = new this.userModel(data);
    return await newUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username });
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      throw new BadRequestException('Invalid user ID');
    }
  }
}
