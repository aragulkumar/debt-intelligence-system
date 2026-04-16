"use client";

import { useState, useRef, useEffect } from "react";
import { coachApi } from "@/lib/api";
import { useDebtSummary } from "@/hooks/useDebts";
import { useHealthScore } from "@/hooks/useHealth";
import { formatCurrency } from "@/lib/utils";
import { Send, Bot } from "lucide-react";
import type { ChatMessage } from "@/types";

export function DebtCoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm your AI Debt Coach. I can help you understand your debts, plan repayments, and answer financial questions. What's on your mind?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const { data: summary } = useDebtSummary();
  const { data: health } = useHealthScore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await coachApi.chat({
        message: userMsg.content,
        conversation_history: messages,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't connect to the server. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stats card above chat — non-negotiable UX requirement */}
      {(summary || health) && (
        <div className="flex gap-4 p-4 rounded-xl border mb-4 flex-wrap glass" style={{ borderColor: "var(--border)" }}>
          {summary && (
            <>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Outstanding</p>
                <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  {formatCurrency(summary.totalOutstanding, true)}
                </p>
              </div>
              <div className="w-px" style={{ background: "var(--border)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Monthly EMI</p>
                <p className="font-bold text-sm" style={{ color: "#6366f1" }}>
                  {formatCurrency(summary.totalMonthlyEmi, true)}
                </p>
              </div>
            </>
          )}
          {health && (
            <>
              <div className="w-px" style={{ background: "var(--border)" }} />
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Health Score</p>
                <p className="font-bold text-sm" style={{ color: health.score >= 70 ? "#10b981" : health.score >= 40 ? "#f59e0b" : "#ef4444" }}>
                  {health.score} / 100 — {health.band.charAt(0).toUpperCase() + health.band.slice(1)}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto space-y-3 pr-1"
        style={{ maxHeight: "calc(100vh - 360px)", minHeight: 200 }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div
              className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
              style={
                msg.role === "user"
                  ? { background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", borderRadius: "18px 18px 4px 18px" }
                  : { background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "18px 18px 18px 4px" }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              <Bot size={14} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "#6366f1", animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
        <input
          id="coach-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask me anything about your debts..."
          className="flex-1 px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        <button
          id="coach-chat-send"
          onClick={send}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff" }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
