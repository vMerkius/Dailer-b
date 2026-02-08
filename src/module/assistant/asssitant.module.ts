import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AssistantController } from 'src/controller';
import { AssistantService } from 'src/service';
import { MessageResourceConfig } from 'src/config/MessageResourceConfig';

@Module({
  imports: [UserModule],
  controllers: [AssistantController],
  providers: [AssistantService, MessageResourceConfig],
})
export class AssistantModule {}
