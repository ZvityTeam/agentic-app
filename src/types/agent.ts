export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}