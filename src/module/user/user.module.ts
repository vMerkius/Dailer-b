import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../../service/user/user.service';
import { UserController } from '../../controller/user/user.controller';
import { UserRepository } from 'src/repository';
import { User, UserSchema, Day, DaySchema } from '../../model';
import { MessageResourceConfig } from '../../config/MessageResourceConfig';
import { LoginValidator, RegisterValidator } from '../../validator';

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
    LoginValidator,
  ],
})
export class UserModule {}
