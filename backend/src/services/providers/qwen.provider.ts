import { PrismaClient } from "@prisma/client";
import { AIProvider, ChatMessage } from "../../types/ai-provider.types";

const prisma = new PrismaClient();
const QWEN_API_URL = process.env.QWEN_API_URL || "http://localhost:5000";

const OUT_OF_SCOPE_MESSAGE =
    "Xin loi, toi la AI Personal Trainer, chi ho tro cac cau hoi ve tap luyen, dinh duong va suc khoe the chat. Ban co the hoi toi ve chu de nay khong?";

interface RetrievedDoc {
    title: string;
    content: string;
    score: number;
}

async function embedQuery(text: string): Promise<number[]> {
    const res = await fetch(`${QWEN_API_URL}/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`Embed server responded with status ${res.status}`);
    const data = (await res.json()) as { vector: number[] };
    return data.vector;
}

async function retrieveContext(
    embedding: number[],
): Promise<{ context: string; topScore: number }> {
    const embeddingStr = `[${embedding.join(",")}]`;

    const docs = await prisma.$queryRawUnsafe<RetrievedDoc[]>(
        `SELECT title, content, 1 - (embedding <=> $1::vector) AS score
         FROM "KnowledgeBase"
         WHERE embedding IS NOT NULL
         ORDER BY embedding <=> $1::vector
         LIMIT 3`,
        embeddingStr,
    );

    if (!docs || docs.length === 0) return { context: "", topScore: 0 };
    const context = docs
        .map((d, i) => `[${i + 1}] ${d.title}: ${d.content}`)
        .join("\n\n");
    return { context, topScore: docs[0].score };
}

const GYM_KEYWORDS = [
    "tap", "gym", "co bap", "dinh duong", "calo", "protein", "bmi", "tdee",
    "giam can", "tang can", "tang co", "cardio", "the hinh", "suc khoe",
    "chan thuong", "lich tap", "bai tap", "vitamin", "nuoc", "ngu",
];

function hasGymKeyword(message: string): boolean {
    const lower = message.toLowerCase();
    return GYM_KEYWORDS.some((k) => lower.includes(k));
}

const SCOPE_THRESHOLD = 0.35;

function isInScopeHeuristic(message: string, topScore: number): boolean {
    if (topScore >= SCOPE_THRESHOLD) return true;
    return hasGymKeyword(message);
}

async function readStreamToString(res: Response): Promise<string> {
    const reader = res.body?.getReader();
    if (!reader) return "";
    const decoder = new TextDecoder();
    let full = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
    }
    return full;
}

const generateReply = async (
    message: string,
    history: ChatMessage[],
): Promise<string> => {
    const embedding = await embedQuery(message);
    const { context, topScore } = await retrieveContext(embedding);

    if (!isInScopeHeuristic(message, topScore)) {
        return OUT_OF_SCOPE_MESSAGE;
    }

    const augmentedMessage = context
        ? `Dua tren thong tin sau day:\n${context}\n\nCau hoi cua nguoi dung: ${message}`
        : message;

    const trimmedHistory = history.slice(-6).map((h) => ({
        role: h.role,
        content: h.content,
    }));

    try {
        const res = await fetch(`${QWEN_API_URL}/chat/stream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: augmentedMessage, history: trimmedHistory }),
            signal: AbortSignal.timeout(60000),
        });

        if (!res.ok) throw new Error(`Qwen server responded with status ${res.status}`);

        const reply = await readStreamToString(res);
        return reply || "Xin loi, toi khong the tra loi luc nay.";
    } catch (err) {
        console.error("Qwen provider error:", err);
        return "Xin loi, AI Trainer (local model) hien khong san sang. Vui long kiem tra server Qwen dang chay chua.";
    }
};

const generateReplyStream = async (
    message: string,
    history: ChatMessage[],
    onToken: (chunk: string) => void,
): Promise<string> => {
    const embedding = await embedQuery(message);
    const { context, topScore } = await retrieveContext(embedding);

    if (!isInScopeHeuristic(message, topScore)) {
        onToken(OUT_OF_SCOPE_MESSAGE);
        return OUT_OF_SCOPE_MESSAGE;
    }

    const augmentedMessage = context
        ? `Dua tren thong tin sau day:\n${context}\n\nCau hoi cua nguoi dung: ${message}`
        : message;

    const trimmedHistory = history.slice(-6).map((h) => ({
        role: h.role,
        content: h.content,
    }));

    let full = "";
    try {
        const res = await fetch(`${QWEN_API_URL}/chat/stream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: augmentedMessage, history: trimmedHistory }),
            signal: AbortSignal.timeout(60000),
        });

        if (!res.ok || !res.body) throw new Error(`Qwen server responded with status ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            full += chunk;
            onToken(chunk);
        }
        return full || "Xin loi, toi khong the tra loi luc nay.";
    } catch (err) {
        console.error("Qwen provider stream error:", err);
        const fallback = "Xin loi, AI Trainer (local model) hien khong san sang.";
        onToken(fallback);
        return fallback;
    }
};

export const qwenProvider: AIProvider = { generateReply, generateReplyStream };