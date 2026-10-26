export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatRequestBody {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export interface ChatResponseBody {
  role: "assistant";
  content: string;
  model: string;
}

export interface ChatErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
