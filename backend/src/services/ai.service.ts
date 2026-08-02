import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/errors";
import { qwenProvider } from "./providers/qwen.provider";
import { AIProvider } from "../types/ai-provider.types";

const prisma = new PrismaClient();

// Chon provider dua tren env var AI_PROVIDER (mac dinh: qwen)
const getProvider = (): AIProvider => qwenProvider;

async function checkAndUpdateUsage(userId: string): Promise<void> {
    const membership = await prisma.userMembership.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { plan: true },
    });

    if (!membership) {
        throw new AppError(
            403,
            "AI_001: No active membership. Please purchase a plan.",
        );
    }

    const now = new Date();
    const isNewDay =
        now.toDateString() !== new Date(membership.aiDailyReset).toDateString();
    const isNewMonth =
        now.getMonth() !== new Date(membership.aiUsageReset).getMonth() ||
        now.getFullYear() !== new Date(membership.aiUsageReset).getFullYear();

    let { aiDailyCount, aiUsageCount } = membership;
    if (isNewDay) aiDailyCount = 0;
    if (isNewMonth) aiUsageCount = 0;

    const { aiDailyLimit, aiLimit } = membership.plan;

    if (aiDailyLimit !== -1 && aiDailyCount >= aiDailyLimit) {
        throw new AppError(
            429,
            `AI_002: Daily limit reached (${aiDailyLimit}/day). Upgrade your plan.`,
        );
    }
    if (aiLimit !== -1 && aiUsageCount >= aiLimit) {
        throw new AppError(
            429,
            `AI_003: Monthly limit reached (${aiLimit}/month). Upgrade your plan.`,
        );
    }

    await prisma.userMembership.update({
        where: { id: membership.id },
        data: {
            aiDailyCount: aiDailyCount + 1,
            aiUsageCount: aiUsageCount + 1,
            aiDailyReset: isNewDay ? now : membership.aiDailyReset,
            aiUsageReset: isNewMonth ? now : membership.aiUsageReset,
        },
    });
}

async function getOrCreateSession(
    userId: string,
    sessionId: string | undefined,
    firstMessage: string,
): Promise<string> {
    if (sessionId) {
        const existing = await prisma.chatSession.findUnique({
            where: { id: sessionId },
        });
        if (existing) {
            await prisma.chatSession.update({
                where: { id: sessionId },
                data: { updatedAt: new Date() },
            });
            return sessionId;
        }
    }

    const title =
        firstMessage.length > 50
            ? firstMessage.slice(0, 50) + "..."
            : firstMessage;

    const session = await prisma.chatSession.create({
        data: { userId, title },
    });
    return session.id;
}

async function chat(
    userId: string,
    message: string,
    sessionId?: string,
): Promise<{ sessionId: string; answer: string; usage: object }> {
    await checkAndUpdateUsage(userId);

    const currentSessionId = await getOrCreateSession(
        userId,
        sessionId,
        message,
    );

    const history = await prisma.chatHistory.findMany({
        where: { userId, sessionId: currentSessionId },
        orderBy: { createdAt: "asc" },
        take: 10,
    });

    const chatHistory = history.map((h) => ({
        role: h.role === "user" ? ("user" as const) : ("assistant" as const),
        content: h.content,
    }));

    const provider = getProvider();
    const answer = await provider.generateReply(message, chatHistory);

    await prisma.chatHistory.createMany({
        data: [
            {
                userId,
                sessionId: currentSessionId,
                role: "user",
                content: message,
            },
            {
                userId,
                sessionId: currentSessionId,
                role: "assistant",
                content: answer,
            },
        ],
    });

    const updatedMembership = await prisma.userMembership.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { plan: true },
    });

    return {
        sessionId: currentSessionId,
        answer,
        usage: {
            aiDailyCount: updatedMembership?.aiDailyCount ?? 0,
            aiUsageCount: updatedMembership?.aiUsageCount ?? 0,
            aiDailyLimit: updatedMembership?.plan.aiDailyLimit ?? 0,
            aiLimit: updatedMembership?.plan.aiLimit ?? 0,
        },
    };
}

async function chatStream(
    userId: string,
    message: string,
    sessionId: string | undefined,
    onToken: (chunk: string) => void,
): Promise<{ sessionId: string; answer: string; usage: object }> {
    await checkAndUpdateUsage(userId);

    const currentSessionId = await getOrCreateSession(
        userId,
        sessionId,
        message,
    );

    const history = await prisma.chatHistory.findMany({
        where: { userId, sessionId: currentSessionId },
        orderBy: { createdAt: "asc" },
        take: 10,
    });

    const chatHistory = history.map((h) => ({
        role: h.role === "user" ? ("user" as const) : ("assistant" as const),
        content: h.content,
    }));

    const provider = getProvider();
    const answer = await provider.generateReplyStream(
        message,
        chatHistory,
        onToken,
    );

    await prisma.chatHistory.createMany({
        data: [
            {
                userId,
                sessionId: currentSessionId,
                role: "user",
                content: message,
            },
            {
                userId,
                sessionId: currentSessionId,
                role: "assistant",
                content: answer,
            },
        ],
    });

    const updatedMembership = await prisma.userMembership.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { plan: true },
    });

    return {
        sessionId: currentSessionId,
        answer,
        usage: {
            aiDailyCount: updatedMembership?.aiDailyCount ?? 0,
            aiUsageCount: updatedMembership?.aiUsageCount ?? 0,
            aiDailyLimit: updatedMembership?.plan.aiDailyLimit ?? 0,
            aiLimit: updatedMembership?.plan.aiLimit ?? 0,
        },
    };
}

async function listSessions(userId: string) {
    return prisma.chatSession.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
    });
}

async function getChatHistory(userId: string, sessionId?: string) {
    const where = sessionId ? { userId, sessionId } : { userId };
    return prisma.chatHistory.findMany({
        where,
        orderBy: { createdAt: "asc" },
    });
}

async function getUsage(userId: string) {
    return prisma.userMembership.findFirst({
        where: { userId, status: "ACTIVE" },
        include: { plan: true },
    });
}

export const aiService = {
    chat,
    chatStream,
    getChatHistory,
    getUsage,
    listSessions,
};
