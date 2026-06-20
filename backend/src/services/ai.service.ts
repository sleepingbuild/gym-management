import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/errors";

const prisma = new PrismaClient();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

async function embedQuery(text: string): Promise<number[]> {
    const result = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
    });
    return result.embeddings![0].values!;
}

async function retrieveContext(query: string): Promise<string> {
    const embedding = await embedQuery(query);
    const embeddingStr = `[${embedding.join(",")}]`;

    const docs = await prisma.$queryRaw<{ title: string; content: string }[]>`
    SELECT title, content
    FROM "KnowledgeBase"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${embeddingStr}::vector
    LIMIT 3
  `;

    if (docs.length === 0) return "";
    return docs
        .map((d, i) => `[${i + 1}] ${d.title}: ${d.content}`)
        .join("\n\n");
}

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

async function chat(
    userId: string,
    message: string,
    sessionId?: string,
): Promise<{ sessionId: string; answer: string; usage: object }> {
    console.log("=== AI SERVICE CHAT CALLED ===", { userId, message }); // ADD THIS
    await checkAndUpdateUsage(userId);

    const currentSessionId = sessionId || uuidv4();

    const history = await prisma.chatHistory.findMany({
        where: { userId, sessionId: currentSessionId },
        orderBy: { createdAt: "asc" },
        take: 10,
    });

    const context = await retrieveContext(message);

    const conversationHistory = history.map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }],
    }));

    const systemPrompt = `Ban la AI Personal Trainer cua IronFit Pro - mot phong gym chuyen nghiep.
Nhiem vu cua ban la tu van ve tap luyen, dinh duong va suc khoe cho thanh vien.

KIEN THUC LIEN QUAN:
${context || "Khong co context cu the, hay tra loi dua tren kien thuc chung ve fitness."}

QUY TAC:
- Tra loi bang tieng Viet, than thien va chuyen nghiep
- Dua vao kien thuc duoc cung cap o tren de tra loi
- Neu khong biet, hay thanh that va goi y tham khao PT
- Khong tu van y te chuyen sau, hay goi y gap bac si neu can
- Cau tra loi ngan gon, de hieu, co the dung emoji phu hop`;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            {
                role: "model",
                parts: [
                    {
                        text: "Toi hieu, toi se ho tro ban voi tu cach la AI Personal Trainer cua IronFit Pro.",
                    },
                ],
            },
            ...conversationHistory,
            { role: "user", parts: [{ text: message }] },
        ],
    });

    const answer = response.text ?? "Xin loi, toi khong the tra loi luc nay.";

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

export const aiService = { chat, getChatHistory, getUsage };
