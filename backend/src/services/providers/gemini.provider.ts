import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";
import { AIProvider, ChatMessage } from "../../types/ai-provider.types";

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

const generateReply = async (
    message: string,
    history: ChatMessage[],
): Promise<string> => {
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

    return response.text ?? "Xin loi, toi khong the tra loi luc nay.";
};

export const geminiProvider: AIProvider = { generateReply };
