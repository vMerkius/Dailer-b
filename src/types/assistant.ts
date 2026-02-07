export type IOpenRouterResponse = {
  id: string;
  choices: IChoice[];
  created: number;
  model: string;
  object: string;
  usage?: IUsage;
};

type IChoice = {
  finishReason: string | null;
  index: number;
  message: IMessage;
  logprobs?: unknown;
};

type IMessage = {
  role: string;
  content?: string | unknown[] | null | undefined;
  refusal?: unknown;
  reasoning?: unknown;
};

type IUsage = {
  completionTokens: number;
  promptTokens: number;
  totalTokens: number;
  completionTokensDetails?: {
    reasoningTokens?: number | null;
    audioTokens?: number | null;
  } | null;
  promptTokensDetails?: {
    cachedTokens?: number | null;
    audioTokens?: number | null;
  } | null;
};
