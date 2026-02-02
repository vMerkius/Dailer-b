import { Module } from '@nestjs/common';
import { AuthController } from '../../controller';
import { AuthService } from 'src/service';
import { UserModule } from '../user/user.module';
import { LoginValidator, RegisterValidator } from '../../validator';
import { MessageResourceConfig } from '../../config/MessageResourceConfig';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginValidator,
    RegisterValidator,
    MessageResourceConfig,
  ],
})
export class AuthModule {}
