import { Controller, Post, Body } from '@nestjs/common';
import { AssistantService } from 'src/service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('chat')
  async chat(@Body('prompt') prompt: string) {
    const response = await this.assistantService.getResponse(prompt);
    return { response };
  }
}
