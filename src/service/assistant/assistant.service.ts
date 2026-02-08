import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenRouter } from '@openrouter/sdk';
import { MessageResourceConfig } from 'src/config/MessageResourceConfig';
import { AssistantErrorCode } from 'src/exception/error';
import { IOpenRouterResponse } from 'src/types';

@Injectable()
export class AssistantService {
  constructor(private messageResourceConfig: MessageResourceConfig) {}

  private readonly openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
    // debugLogger: console,
  });

  async getResponse(prompt: string): Promise<unknown> {
    try {
      const completion: IOpenRouterResponse | undefined =
        await this.openRouter.chat.send({
          chatGenerationParams: {
            model: 'openrouter/free',
            messages: [{ role: 'user', content: prompt }],
            stream: false,
          },
        });
      if (!completion) {
        this.throwResponseError();
      }

      return completion;
    } catch (error) {
      console.error('Error in AssistantService.getResponse:', error);
      this.throwResponseError();
    }
  }

  private throwResponseError(): never {
    throw new InternalServerErrorException({
      code: AssistantErrorCode.RESPONSE_ERROR,
      message: this.messageResourceConfig.getMessage(
        AssistantErrorCode.RESPONSE_ERROR,
      ),
      statusCode: this.messageResourceConfig.getStatusCode(
        AssistantErrorCode.RESPONSE_ERROR,
      ),
    });
  }
}
