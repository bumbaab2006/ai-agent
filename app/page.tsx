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
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.82),_transparent_32%),linear-gradient(135deg,#f4efe4_0%,#d9e5ec_46%,#f7f7f2_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6 lg:py-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[#15313b] p-6 text-white shadow-[0_30px_90px_rgba(21,49,59,0.28)] lg:w-[38%] lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,184,107,0.22),_transparent_24%)]" />
          <div className="relative flex h-full flex-col">
            <div className="mb-6 flex items-center justify-between">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                Pinecone Demo
              </span>
              <span className="rounded-full bg-emerald-300/18 px-3 py-1 text-xs font-medium text-emerald-100">
                Knowledge Retrieval Active
              </span>
            </div>

            <div className="max-w-md space-y-5">
              <p className="text-sm uppercase tracking-[0.28em] text-[#f3d1a2]">
                Experimental AI Agent
              </p>
              <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
                Company knowledge-г хэрэглэгчид ойлгомжтой хүргэх туршилтын чат.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-200/88 lg:text-base">
                Энэ demo нь асуултыг embedding болгож, Pinecone дахь knowledge
                base-с хамгийн ойр контекстуудыг олж, дараа нь Gemini-ээр
                тайлбарласан хариулт буцааж байна.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:mt-10 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Data Source
                </p>
                <p className="mt-2 text-sm text-white/90">
                  Structured company profile, services, policy, FAQ
                </p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Retrieval Flow
                </p>
                <p className="mt-2 text-sm text-white/90">
                  Question - Embedding - Pinecone search - Context - Gemini
                </p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Use Case
                </p>
                <p className="mt-2 text-sm text-white/90">
                  Customer inquiry, internal helpdesk, enterprise knowledge demo
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-white/12 bg-black/10 p-5 backdrop-blur-sm lg:mt-auto">
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                Suggested Questions
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-left text-sm text-white transition hover:bg-white/16"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[70vh] flex-1 flex-col rounded-[32px] border border-slate-200/70 bg-white/72 shadow-[0_24px_70px_rgba(26,43,54,0.12)] backdrop-blur-xl">
          <div className="border-b border-slate-200/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  AI Conversation
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Semantic search chat
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Асуулт асуухад system нь knowledge base-оос холбоотой хэсгүүдийг
                  татаад хариулж байна.
                </p>
              </div>
              <div className="flex gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-slate-900 px-3 py-1.5 font-medium text-white">
                  Pinecone
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium">
                  Granite Embeddings
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium">
                  Gemini
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,246,248,0.92))] px-6 py-10 text-center">
                <div className="rounded-full bg-[#15313b] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#f3d1a2]">
                  Ready to query
                </div>
                <h3 className="mt-5 max-w-lg text-3xl font-semibold leading-tight text-slate-900">
                  Компанийн мэдлэгийн сангаас утгад суурилж хариулт авна.
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                  Доорх prompt-уудаас сонгох эсвэл өөрийн асуултыг бич. Энэ UI
                  нь Pinecone retrieval туршилтыг илүү ойлгомжтой харуулах demo
                  interface юм.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendQuestion(prompt)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={`${msg.role}-${index}`}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] rounded-[24px] px-4 py-3 shadow-sm sm:max-w-[82%] ${
                        msg.role === "user"
                          ? "bg-[#15313b] text-white"
                          : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      <p
                        className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                          msg.role === "user"
                            ? "text-[#f3d1a2]"
                            : "text-slate-400"
                        }`}
                      >
                        {msg.role === "user" ? "You" : "AI Agent"}
                      </p>
                      <p className="whitespace-pre-wrap text-sm leading-7">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        AI Agent
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                        <span className="ml-2">Хариулт боловсруулж байна...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-slate-200/70 bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-6">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-3 shadow-inner shadow-white/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label
                    htmlFor="chat-input"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"
                  >
                    Your question
                  </label>
                  <textarea
                    id="chat-input"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                    placeholder="Жишээ нь: Танай AI agent ямар салбаруудад ашиглагддаг вэ?"
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
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#15313b] px-6 text-sm font-semibold text-white transition hover:bg-[#0f252d] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {loading ? "Түр хүлээнэ үү" : "Илгээх"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
