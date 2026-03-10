"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const quickPrompts = [
  "Танай компани ямар үйлчилгээ үзүүлдэг вэ?",
  "AI agent мэдээллээ яаж олж авч байна вэ?",
  "2026 оны roadmap-д юу байгаа вэ?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendQuestion = async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const userMessage: Message = { role: "user", text: trimmedQuestion };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      if (!response.ok) throw new Error("API алдаа гарлаа");

      const data = await response.json();
      const aiMessage: Message = {
        role: "ai",
        text: data.answer || "Хариулт ирсэнгүй",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Алдаа:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Алдаа гарлаа. Дахин оролдоно уу." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    await sendQuestion(input);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <header className="mx-auto w-full max-w-3xl text-center">
          <p className="text-sm font-medium text-[#6e6e73]">Pinecone Demo</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-5xl">
            AI knowledge assistant
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6e6e73] sm:text-lg">
            Company knowledge base-с утгад суурилж хариулт гаргах энгийн,
            төвлөрсөн туршилтын чат.
          </p>
        </header>

        <section className="mt-10 grid flex-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h2 className="text-sm font-semibold text-[#1d1d1f]">
                About this demo
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-6 text-[#6e6e73]">
                <p>Pinecone retrieval, Granite embeddings, Gemini response.</p>
                <p>
                  Хэрэглэгчийн асуултад хамгийн ойр мэдлэгийн хэсгийг олж
                  тайлбарласан хариулт өгнө.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <h2 className="text-sm font-semibold text-[#1d1d1f]">
                Suggested prompts
              </h2>
              <div className="mt-4 flex flex-col gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-2xl border border-black/8 bg-[#fbfbfd] px-4 py-3 text-left text-sm leading-6 text-[#3a3a3c] transition hover:bg-white hover:text-[#1d1d1f]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex min-h-[68vh] flex-col rounded-[32px] border border-black/6 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="border-b border-black/6 px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#6e6e73]">
                    Semantic search chat
                  </p>
                  <p className="mt-1 text-sm text-[#8e8e93]">
                    Knowledge base-с retrieval хийж хариулж байна
                  </p>
                </div>
                <div className="rounded-full border border-black/6 bg-[#fbfbfd] px-4 py-2 text-xs font-medium text-[#6e6e73]">
                  Live demo
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="max-w-2xl">
                    <h3 className="text-3xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                      Ask a question
                    </h3>
                    <p className="mt-4 text-base leading-7 text-[#6e6e73]">
                      Энэ интерфэйс нь minimalist байдлаар зөвхөн асуулт,
                      retrieval, хариулт гэсэн үндсэн урсгалд төвлөрч байна.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendQuestion(prompt)}
                        className="rounded-full border border-black/8 bg-white px-4 py-2.5 text-sm text-[#3a3a3c] transition hover:border-black/12 hover:text-[#1d1d1f]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, index) => (
                    <div
                      key={`${msg.role}-${index}`}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[92%] rounded-[24px] px-5 py-4 sm:max-w-[80%] ${
                          msg.role === "user"
                            ? "bg-[#1d1d1f] text-white"
                            : "border border-black/6 bg-[#fbfbfd] text-[#1d1d1f]"
                        }`}
                      >
                        <p
                          className={`text-[11px] font-medium uppercase tracking-[0.22em] ${
                            msg.role === "user"
                              ? "text-white/55"
                              : "text-[#8e8e93]"
                          }`}
                        >
                          {msg.role === "user" ? "You" : "Assistant"}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-[24px] border border-black/6 bg-[#fbfbfd] px-5 py-4 text-sm text-[#6e6e73]">
                        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8e8e93]">
                          Assistant
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[#b0b0b5]" />
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[#b0b0b5] [animation-delay:120ms]" />
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[#b0b0b5] [animation-delay:240ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t border-black/6 px-5 py-5 sm:px-8">
              <div className="rounded-[28px] border border-black/8 bg-[#fbfbfd] p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label
                      htmlFor="chat-input"
                      className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-[#8e8e93]"
                    >
                      Message
                    </label>
                    <textarea
                      id="chat-input"
                      rows={3}
                      className="w-full resize-none rounded-[20px] border border-black/6 bg-white px-4 py-3 text-[15px] leading-6 text-[#1d1d1f] outline-none transition placeholder:text-[#a1a1a6] focus:border-black/18"
                      placeholder="Асуултаа энд бичнэ үү..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleSend();
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={loading || !input.trim()}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#1d1d1f] px-6 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#d2d2d7]"
                  >
                    {loading ? "Thinking..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
