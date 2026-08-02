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

interface Session {
  id: string;
  title: string;
  updatedAt: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content:
      "Xin chào! Tôi là AI Personal Trainer của IronFit Pro 💪\n\nTôi có thể giúp bạn về:\n• Lịch tập luyện phù hợp\n• Dinh dưỡng và chế độ ăn\n• Kỹ thuật tập các bài tập\n• Tính toán calo và BMI\n\nBạn muốn hỏi gì hôm nay?",
    createdAt: new Date(),
  };

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

    const fetchSessions = async () => {
      try {
        const res = await api.get("/ai/sessions");
        setSessions(res.data.data.sessions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsage();
    fetchSessions();
    setMessages([welcomeMessage]);
  }, []);

  const startNewChat = () => {
    setSessionId(null);
    setMessages([welcomeMessage]);
  };

  const loadSession = async (id: string) => {
    setSessionId(id);
    try {
      const res = await api.get(`/ai/history?sessionId=${id}`);
      const history = res.data.data.history.map(
        (h: {
          id: string;
          role: string;
          content: string;
          createdAt: string;
        }) => ({
          id: h.id,
          role: h.role,
          content: h.content,
          createdAt: new Date(h.createdAt),
        }),
      );
      setMessages(history);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    };
    const assistantId = uuidv4();

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: "assistant", content: "", createdAt: new Date() },
    ]);
    setInput("");
    setLoading(true);

    let queue = "";
    const REVEAL_MS = 20; // ~50 ky tu/giay, dieu chinh de nhanh/cham theo y thich

    const revealInterval = setInterval(() => {
      if (queue.length > 0) {
        const nextChar = queue[0];
        queue = queue.slice(1);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content + nextChar }
              : m,
          ),
        );
      }
    }, REVEAL_MS);

    try {
      const stored = localStorage.getItem("ironfit-auth");
      const token = stored ? JSON.parse(stored)?.state?.accessToken : null;
      const baseURL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const res = await fetch(`${baseURL}/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: userMessage.content, sessionId }),
      });

      if (!res.ok || !res.body) throw new Error("Stream request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const payload = JSON.parse(part.slice(6));

          if (payload.chunk) {
            queue += payload.chunk;
          }

          if (payload.done) {
            if (payload.usage) {
              setUsage((prev) =>
                prev
                  ? {
                    ...prev,
                    aiDailyCount: payload.usage.aiDailyCount,
                    aiUsageCount: payload.usage.aiUsageCount,
                  }
                  : null,
              );
            }
            if (payload.sessionId && payload.sessionId !== sessionId) {
              setSessionId(payload.sessionId);
              setSessions((prev) => {
                const exists = prev.some((s) => s.id === payload.sessionId);
                if (exists) return prev;
                return [
                  {
                    id: payload.sessionId,
                    title:
                      userMessage.content.length > 50
                        ? userMessage.content.slice(0, 50) + "..."
                        : userMessage.content,
                    updatedAt: new Date().toISOString(),
                  },
                  ...prev,
                ];
              });
            }
          }
        }
      }

      // Doi hang doi nha het chu truoc khi ket thuc trang thai loading
      await new Promise<void>((resolve) => {
        const check = () => {
          if (queue.length === 0) resolve();
          else setTimeout(check, 30);
        };
        check();
      });
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "❌ Có lỗi xảy ra, vui lòng thử lại." }
            : m,
        ),
      );
    } finally {
      clearInterval(revealInterval);
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
    <div className="flex gap-4 h-[calc(100vh-96px)]">
      {/* Sidebar phiên chat */}
      <div className="w-64 flex-shrink-0 bg-surface-card border border-hairline rounded-xl flex flex-col overflow-hidden">
        <div className="p-3 border-b border-hairline">
          <button
            onClick={startNewChat}
            className="w-full py-2.5 px-3 bg-primary hover:bg-primary-active text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Đoạn chat mới
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => loadSession(s.id)}
              className={`text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${sessionId === s.id
                  ? "bg-surface-dark-elevated text-ink"
                  : "text-muted hover:bg-surface-dark-soft"
                }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
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

          {usage && (
            <div className="bg-surface-card border border-hairline rounded-lg px-4 py-3 text-right min-w-[160px]">
              <p className="text-caption-uppercase text-muted mb-1.5">
                Gói {usage.plan}
              </p>
              <p className="text-body-sm text-ink font-medium">
                {usage.aiDailyCount}/{isUnlimited ? "∞" : usage.aiDailyLimit}{" "}
                hôm nay
              </p>
              {!isUnlimited && (
                <div className="mt-1.5 bg-hairline rounded-full h-[3px]">
                  <div
                    className={`rounded-full h-[3px] transition-all duration-300 ${dailyPercent >= 90 ? "bg-error" : "bg-primary"
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
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-amber rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🤖</span>
                  </div>
                )}

                <div
                  className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === "user"
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

            {loading &&
              messages.length > 0 &&
              messages[messages.length - 1].role === "assistant" &&
              messages[messages.length - 1].content === "" && (
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
              className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${loading || !input.trim()
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
    </div>
  );
}