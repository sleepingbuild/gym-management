import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1, 'AI_004: Message is required'),
  sessionId: z.string().optional(),
});

const chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { message, sessionId } = chatSchema.parse(req.body);
    const userId = req.user!.userId;

    console.log('AI Chat request:', { userId, message, sessionId }); // DEBUG

    const result = await aiService.chat(userId, message, sessionId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'AI response generated',
      data: result,
    });
  } catch (error) {
    console.error('AI Chat error:', error); // DEBUG
    next(error);
  }
};

const getChatHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const sessionId = req.query.sessionId as string | undefined;

    const history = await aiService.getChatHistory(userId, sessionId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Chat history retrieved',
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};

const getUsage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const membership = await aiService.getUsage(userId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Usage retrieved',
      data: {
        aiDailyCount: membership?.aiDailyCount ?? 0,
        aiUsageCount: membership?.aiUsageCount ?? 0,
        aiDailyLimit: membership?.plan.aiDailyLimit ?? 0,
        aiLimit: membership?.plan.aiLimit ?? 0,
        plan: membership?.plan.name ?? 'None',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const aiController = { chat, getChatHistory, getUsage };