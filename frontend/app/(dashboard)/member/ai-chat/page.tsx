'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
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
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const [usage, setUsage] = useState<Usage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToEnd = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, loading, scrollToEnd]);

  // Load usage stats
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await api.get('/ai/usage');
        setUsage(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsage();

    // Welcome message
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Xin chào! Tôi là AI Personal Trainer của IronFit Pro 💪\n\nTôi có thể giúp bạn về:\n• Lịch tập luyện phù hợp\n• Dinh dưỡng và chế độ ăn\n• Kỹ thuật tập các bài tập\n• Tính toán calo và BMI\n\nBạn muốn hỏi gì hôm nay?',
      createdAt: new Date(),
    }]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: userMessage.content,
        sessionId,
      });

      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: res.data.data.answer,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update usage
      if (res.data.data.usage) {
        setUsage(prev => prev ? {
          ...prev,
          aiDailyCount: res.data.data.usage.aiDailyCount,
          aiUsageCount: res.data.data.usage.aiUsageCount,
        } : null);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';

      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: `❌ ${errorMsg}`,
        createdAt: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isUnlimited = usage?.aiDailyLimit === -1;
  const dailyPercent = !isUnlimited && usage
    ? Math.min((usage.aiDailyCount / usage.aiDailyLimit) * 100, 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 96px)' }}>

      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#141413', fontWeight: 400, letterSpacing: '-0.5px' }}>
            AI Personal Trainer
          </h1>
          <p style={{ color: '#6c6a64', fontSize: '14px', marginTop: '4px' }}>
            Hỏi về tập luyện, dinh dưỡng và sức khỏe
          </p>
        </div>

        {/* Usage badge */}
        {usage && (
          <div style={{ backgroundColor: '#efe9de', borderRadius: '10px', padding: '12px 16px', textAlign: 'right', minWidth: '160px' }}>
            <p style={{ fontSize: '11px', color: '#6c6a64', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              Gói {usage.plan}
            </p>
            <p style={{ fontSize: '14px', color: '#141413', fontWeight: 500 }}>
              {usage.aiDailyCount}/{isUnlimited ? '∞' : usage.aiDailyLimit} hôm nay
            </p>
            {!isUnlimited && (
              <div style={{ marginTop: '6px', backgroundColor: '#e8e0d2', borderRadius: '9999px', height: '3px' }}>
                <div style={{
                  backgroundColor: dailyPercent >= 90 ? '#c64545' : '#cc785c',
                  borderRadius: '9999px',
                  height: '3px',
                  width: `${dailyPercent}%`,
                  transition: 'width 0.3s',
                }} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat container */}
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        border: '1px solid #e6dfd8',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '8px',
              }}
            >
              {/* AI Avatar */}
              {msg.role === 'assistant' && (
                <div style={{
                  width: '32px', height: '32px',
                  backgroundColor: '#181715',
                  borderRadius: '9999px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '14px' }}>🤖</span>
                </div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
                backgroundColor: msg.role === 'user' ? '#cc785c' : '#f5f0e8',
                color: msg.role === 'user' ? 'white' : '#141413',
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div style={{
                  width: '32px', height: '32px',
                  backgroundColor: '#cc785c',
                  borderRadius: '9999px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>U</span>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px',
                backgroundColor: '#181715',
                borderRadius: '9999px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '14px' }}>🤖</span>
              </div>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f5f0e8',
                borderRadius: '18px 18px 18px 4px',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}>
                <style>{`
                  @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                  }
                `}</style>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: '7px', height: '7px',
                    backgroundColor: '#a09d96',
                    borderRadius: '9999px',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e6dfd8',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          backgroundColor: '#faf9f5',
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi... (Enter để gửi, Shift+Enter xuống dòng)"
            rows={1}
            style={{
              flex: 1,
              padding: '10px 14px',
              backgroundColor: 'white',
              border: '1px solid #e6dfd8',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#141413',
              outline: 'none',
              resize: 'none',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.5',
              maxHeight: '120px',
              overflowY: 'auto',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              width: '42px', height: '42px',
              backgroundColor: loading || !input.trim() ? '#e6dfd8' : '#cc785c',
              border: 'none',
              borderRadius: '12px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.15s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}