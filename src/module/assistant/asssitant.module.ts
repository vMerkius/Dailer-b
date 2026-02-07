import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AssistantController } from 'src/controller';

@Module({
  imports: [UserModule],
  controllers: [AssistantController],
  providers: [],
})
export class AssistantModule {}
