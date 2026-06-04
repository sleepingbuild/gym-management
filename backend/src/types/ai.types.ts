import { ChatRole } from '@prisma/client';

export interface ChatMessage {
  id: string;
  userId: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  tokens: number | null;
  createdAt: Date;
}

export interface SendMessageDTO {
  message: string;
  sessionId?: string; // optional - neu khong co se tao session moi
}

export interface ChatResponse {
  sessionId: string;
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
  usage: {
    aiUsageCount: number;
    aiDailyCount: number;
    aiLimit: number;
    aiDailyLimit: number;
  };
}
