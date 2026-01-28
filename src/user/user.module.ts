import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { User, UserSchema, Day, DaySchema } from './schemas';
import { MessageResourceConfig } from '../config/MessageResourceConfig';
import { RegisterValidator } from '../validator';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Day.name, schema: DaySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
    MessageResourceConfig,
    RegisterValidator,
  ],
})
export class UserModule {}
