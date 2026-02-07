import { Controller, Get } from '@nestjs/common';

@Controller('assistant')
export class AssistantController {
  @Get()
  getAssistant() {
    return 'Hello World';
  }
}
