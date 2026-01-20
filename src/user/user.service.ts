import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<any>) {}

  // async register(createUserDto: CreateUserDto) {
  //   const newUser = new this.userModel(createUserDto);
  //   return await newUser.save();
  // }

  // async login(createUserDto: CreateUserDto) {
  //   const user = await this.userModel.findOne({ email: createUserDto.email });
  //   return user || 'User not found';
  // }

  // async findOne(id: string) {
  //   return await this.userModel.findById(id);
  // }
}
