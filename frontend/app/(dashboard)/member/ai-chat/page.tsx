"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface Usage {
  aiDailyCount: number;
  aiDailyLimit: number;
  aiUsageCount: number;
  aiLimit: number;
  plan: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [usage, setUsage] = useState<Usage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, loading, scrollToEnd]);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await api.get("/ai/usage");
        setUsage(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsage();

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Xin chào! Tôi là AI Personal Trainer của IronFit Pro 💪\n\nTôi có thể giúp bạn về:\n• Lịch tập luyện phù hợp\n• Dinh dưỡng và chế độ ăn\n• Kỹ thuật tập các bài tập\n• Tính toán calo và BMI\n\nBạn muốn hỏi gì hôm nay?",
        createdAt: new Date(),
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: userMessage.content,
        sessionId,
      });

      const aiMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: res.data.data.answer,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (res.data.data.usage) {
        setUsage((prev) =>
          prev
            ? {
                ...prev,
                aiDailyCount: res.data.data.usage.aiDailyCount,
                aiUsageCount: res.data.data.usage.aiUsageCount,
              }
            : null,
        );
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMsg =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";

      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: `❌ ${errorMsg}`,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isUnlimited = usage?.aiDailyLimit === -1;
  const dailyPercent =
    !isUnlimited && usage
      ? Math.min((usage.aiDailyCount / usage.aiDailyLimit) * 100, 100)
      : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-96px)]">
      {/* Header */}
      <div className="mb-5 flex justify-between items-start gap-4">
        <div>
          <h1 className="font-display text-display-sm text-ink">
            AI Personal Trainer
          </h1>
          <p className="text-muted text-body-sm mt-1">
            Hỏi về tập luyện, dinh dưỡng và sức khỏe
          </p>
        </div>

        {/* Usage badge */}
        {usage && (
          <div className="bg-surface-card border border-hairline rounded-lg px-4 py-3 text-right min-w-[160px]">
            <p className="text-caption-uppercase text-muted mb-1.5">
              Gói {usage.plan}
            </p>
            <p className="text-body-sm text-ink font-medium">
              {usage.aiDailyCount}/{isUnlimited ? "∞" : usage.aiDailyLimit} hôm
              nay
            </p>
            {!isUnlimited && (
              <div className="mt-1.5 bg-hairline rounded-full h-[3px]">
                <div
                  className={`rounded-full h-[3px] transition-all duration-300 ${
                    dailyPercent >= 90 ? "bg-error" : "bg-primary"
                  }`}
                  style={{ width: `${dailyPercent}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat container */}
      <div className="flex-1 bg-surface-card border border-hairline rounded-xl flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-amber rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🤖</span>
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-[18px_18px_4px_18px]"
                    : "bg-surface-dark-elevated text-ink rounded-[18px_18px_18px_4px]"
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[13px] font-semibold">
                    U
                  </span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-amber rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🤖</span>
              </div>
              <div className="px-4 py-3 bg-surface-dark-elevated rounded-[18px_18px_18px_4px] flex gap-1 items-center">
                <style>{`
                  @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                  }
                `}</style>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-[7px] h-[7px] bg-muted rounded-full"
                    style={{
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-6 py-4 border-t border-hairline flex gap-3 items-end bg-surface-soft">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi... (Enter để gửi, Shift+Enter xuống dòng)"
            rows={1}
            className="flex-1 px-3.5 py-2.5 bg-surface-dark-soft border border-hairline rounded-xl text-sm text-ink outline-none resize-none placeholder:text-muted max-h-[120px] overflow-y-auto focus:border-primary transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
              loading || !input.trim()
                ? "bg-hairline cursor-not-allowed"
                : "bg-primary hover:bg-primary-active cursor-pointer"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}