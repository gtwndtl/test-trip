export interface GroqRequest {
  prompt: string;
}

export interface GroqChoiceMessage {
  role: string;
  content: string;
}

export interface GroqChoice {
  message: GroqChoiceMessage;
  finish_reason: string;
  index: number;
}

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: GroqChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
