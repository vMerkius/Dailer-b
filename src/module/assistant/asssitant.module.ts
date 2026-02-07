import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AssistantController } from 'src/controller';
import { AssistantService } from 'src/service';

@Module({
  imports: [UserModule],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
