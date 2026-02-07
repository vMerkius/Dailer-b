import { Injectable } from '@nestjs/common';
import { OpenRouter } from '@openrouter/sdk';
import { IOpenRouterResponse } from 'src/types';

@Injectable()
export class AssistantService {
  private readonly openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
    debugLogger: console,
  });

  async getResponse(prompt: string): Promise<unknown> {
    const completion: IOpenRouterResponse = await this.openRouter.chat.send({
      chatGenerationParams: {
        model: 'openrouter/free',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      },
    });
    return completion;
  }
}
