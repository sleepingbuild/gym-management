import { AIProvider, ChatMessage } from "../../types/ai-provider.types";

const QWEN_API_URL = process.env.QWEN_API_URL || "http://localhost:5000";

const generateReply = async (
    message: string,
    history: ChatMessage[],
): Promise<string> => {
    // serve.py chi nhan toi da 6 luot gan nhat, format {role, content}
    const trimmedHistory = history.slice(-6).map((h) => ({
        role: h.role,
        content: h.content,
    }));

    try {
        const res = await fetch(`${QWEN_API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                history: trimmedHistory,
            }),
            // Qwen local inference co the cham hon Gemini, timeout dai hon
            signal: AbortSignal.timeout(60000),
        });

        if (!res.ok) {
            throw new Error(`Qwen server responded with status ${res.status}`);
        }

        const data = (await res.json()) as { reply: string };
        return data.reply;
    } catch (err) {
        console.error("Qwen provider error:", err);
        return "Xin loi, AI Trainer (local model) hien khong san sang. Vui long kiem tra server Qwen dang chay chua.";
    }
};

export const qwenProvider: AIProvider = { generateReply };
