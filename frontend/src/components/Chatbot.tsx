import { useState, useRef, useEffect } from "react";
import Sidebar from './Sidebar'
import { useAI } from '../hooks/useAI'

interface Message {
  id: number;
  role: "customer" | "ai";
  text: string;
  time: string;
  tracking?: string;
  sentiment?: string;
}

const quickReplies = ["Özür dile", "Kargo bilgisi ver", "İndirim teklif et", "Yönlendir"];

const sentimentHistory = [
  { dot: "bg-red-500",     text: "Sinirli — kargo gecikmesi", date: "Bugün" },
  { dot: "bg-gray-500",    text: "Nötr — ürün sorusu",        date: "3 gün" },
  { dot: "bg-emerald-500", text: "Mutlu — hızlı teslimat",    date: "12 gün" },
  { dot: "bg-emerald-500", text: "Mutlu — ürün beğendi",      date: "1 ay" },
];

const getSentimentColor = (sentiment: string) => {
  if (sentiment === "angry") return { bg: "rgba(239,68,68,0.15)", text: "#EF4444", emoji: "😠", label: "Sinirli" };
  if (sentiment === "happy") return { bg: "rgba(16,185,129,0.15)", text: "#10B981", emoji: "😊", label: "Mutlu" };
  return { bg: "rgba(107,114,128,0.15)", text: "#8B8B9E", emoji: "😐", label: "Nötr" };
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState("neutral");
  const [showAlert, setShowAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isLoading, sendMessage, createMessage } = useAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = createMessage("customer", input);
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    const result = await sendMessage(currentInput, { customer_name: "Ahmet Yılmaz" });

    if (result) {
      const tracking = result.reply.match(/TRK\w+/)?.[0];
      const aiMsg = createMessage("ai", result.reply, {
        tracking,
        sentiment: result.sentiment,
      });
      setMessages((prev) => [...prev, aiMsg]);
      setCurrentSentiment(result.sentiment);
      if (result.sentiment === "angry") setShowAlert(true);
    } else {
      const errMsg = createMessage("ai", "Üzgünüm, şu an yanıt üretemiyorum. Lütfen tekrar deneyin.");
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sentimentColors = getSentimentColor(currentSentiment);

  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}>
      <Sidebar />

      <main className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ background: "#0A0A0F", borderBottom: "1px solid #1E1E2E" }}>
          <div>
            <h1 className="text-lg font-bold tracking-tight">AI Asistan</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4A4A5E" }}>Müşteri konuşmaları — Gemini destekli duygu analizi</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>🔔</button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">DK</div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 shrink-0" style={{ background: "#0D0D14", borderBottom: "1px solid #1E1E2E" }}>
              <div className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold" style={{ background: sentimentColors.bg, color: sentimentColors.text }}>AY</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Ahmet Yılmaz</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs" style={{ color: "#6B7280" }}>Sipariş #1234 · 8 sipariş geçmişi</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: sentimentColors.bg, color: sentimentColors.text }}>
                    {sentimentColors.emoji} {sentimentColors.label}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center justify-center w-8 h-8 rounded-lg text-[#6B7280]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>📞</button>
                <button className="flex items-center justify-center w-8 h-8 rounded-lg text-[#6B7280]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>⋮</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#2A2A38 transparent" }}>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: "#4A4A5E" }}>
                  <span className="text-4xl">✦</span>
                  <p className="text-sm">Mesaj yazarak Gemini AI asistanı başlatın</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2.5 items-start">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-xs font-bold"
                    style={{ background: msg.role === "customer" ? "rgba(239,68,68,0.2)" : "rgba(99,102,241,0.2)", color: msg.role === "customer" ? "#EF4444" : "#6366F1" }}>
                    {msg.role === "customer" ? "AY" : "✦"}
                  </div>
                  <div className="flex flex-col gap-1 max-w-[75%]">
                    <span className="text-[11px] font-medium" style={{ color: "#4A4A5E" }}>
                      {msg.role === "customer" ? "Ahmet Yılmaz" : "✦ AI Asistan"} · {msg.time}
                    </span>
                    <div className="px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed"
                      style={{
                        background: msg.role === "customer" ? "#1A1A24" : "#0F0F1A",
                        border: msg.role === "customer" ? "1px solid #2A2A38" : "1px solid rgba(99,102,241,0.25)",
                        color: "#C4C4D4",
                        borderTopLeftRadius: "4px",
                      }}>
                      {msg.text}
                      {msg.tracking && (
                        <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-lg" style={{ background: "#1A1A24", border: "1px solid #2A2A38" }}>
                          <span className="text-xs" style={{ color: "#8B8B9E" }}>Takip:</span>
                          <span className="text-xs font-semibold font-mono text-indigo-400">{msg.tracking}</span>
                          <button onClick={() => handleCopy(msg.tracking!)} className="ml-auto text-xs px-2 py-0.5 rounded" style={{ color: copied ? "#10B981" : "#4A4A5E" }}>
                            {copied ? "✓ Kopyalandı" : "Kopyala"}
                          </button>
                        </div>
                      )}
                      {msg.role === "ai" && msg.sentiment && (
                        <div className="mt-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: getSentimentColor(msg.sentiment).bg, color: getSentimentColor(msg.sentiment).text }}>
                            {getSentimentColor(msg.sentiment).emoji} {getSentimentColor(msg.sentiment).label}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indikatörü */}
              {isLoading && (
                <div className="flex gap-2.5 items-start">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-xs font-bold text-indigo-400" style={{ background: "rgba(99,102,241,0.2)" }}>✦</div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium" style={{ color: "#4A4A5E" }}>✦ AI Asistan · şimdi</span>
                    <div className="px-3.5 py-3 rounded-xl" style={{ background: "#0F0F1A", border: "1px solid rgba(99,102,241,0.25)" }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Alert Banner */}
            {showAlert && (
              <div className="mx-5 mb-3 px-3.5 py-2.5 rounded-xl flex items-center gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <span className="text-red-400 text-base">⚠️</span>
                <p className="flex-1 text-xs" style={{ color: "#C4C4D4" }}>
                  <strong className="text-red-400">Duygu uyarısı:</strong> Ahmet Yılmaz sinirli olarak işaretlendi. Dashboard'a uyarı düştü.
                </p>
                <span onClick={() => setShowAlert(false)} className="text-xs text-indigo-400 font-semibold cursor-pointer whitespace-nowrap">Kapat ✕</span>
              </div>
            )}

            {/* Input */}
            <div className="px-5 pb-5 shrink-0" style={{ borderTop: "1px solid #1E1E2E", paddingTop: "14px" }}>
              <div className="flex gap-2 mb-2.5 flex-wrap">
                {quickReplies.map((q) => (
                  <button key={q} onClick={() => setInput(q)} className="px-3 py-1 rounded-full text-xs cursor-pointer"
                    style={{ border: "1px solid #2A2A38", background: "#111118", color: "#8B8B9E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex gap-2.5 items-end">
                <textarea
                  className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px] outline-none resize-none"
                  style={{ background: "#111118", border: "1px solid #2A2A38", fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "42px", maxHeight: "100px", color: "#F1F1F5" }}
                  placeholder={isLoading ? "AI yanıt üretiyor..." : "Mesaj yaz veya AI'ın devam etmesini bekle..."}
                  rows={1}
                  value={input}
                  disabled={isLoading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <button onClick={handleSend} disabled={isLoading}
                  className="flex items-center justify-center w-11 h-11 rounded-xl text-white shrink-0 text-base transition-all"
                  style={{ background: isLoading ? "#4A4A5E" : "#6366F1", cursor: isLoading ? "not-allowed" : "pointer" }}>
                  {isLoading ? "⏳" : "➤"}
                </button>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-72 shrink-0 flex flex-col overflow-y-auto" style={{ borderLeft: "1px solid #1E1E2E", background: "#0D0D14" }}>
            <div className="px-4 py-4" style={{ borderBottom: "1px solid #1E1E2E" }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4A4A5E" }}>Müşteri Bilgisi</p>
              {[
                { label: "Ad",      value: "Ahmet Yılmaz",   mono: false },
                { label: "Telefon", value: "0532 XXX XX 34", mono: false },
                { label: "Sipariş", value: "#1234",          mono: true  },
                { label: "Durum",   value: "Gecikiyor",      color: "#EF4444" },
                { label: "Tutar",   value: "₺450",           mono: false },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-1.5">
                  <span className="text-xs" style={{ color: "#6B7280" }}>{row.label}</span>
                  <span className={`text-xs font-medium ${row.mono ? "font-mono" : ""}`} style={{ color: row.color || "#F1F1F5" }}>{row.value}</span>
                </div>
              ))}
              <div className="mt-3">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs" style={{ color: "#6B7280" }}>Sadakat Skoru</span>
                  <span className="text-xs font-semibold text-amber-400">42/100</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "#1A1A24" }}>
                  <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400" style={{ width: "42%" }} />
                </div>
              </div>
            </div>

            <div className="px-4 py-4" style={{ borderBottom: "1px solid #1E1E2E" }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4A4A5E" }}>Duygu Geçmişi</p>
              <div className="flex flex-col gap-0">
                {sentimentHistory.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2" style={{ borderBottom: i < sentimentHistory.length - 1 ? "1px solid #1A1A24" : "none" }}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
                    <span className="flex-1 text-xs" style={{ color: "#8B8B9E" }}>{item.text}</span>
                    <span className="text-[11px]" style={{ color: "#4A4A5E" }}>{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4A4A5E" }}>AI Önerisi</p>
              <div className="rounded-xl px-3 py-3 mb-3" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-400 mb-1.5">✦ Gemini Analizi</p>
                <p className="text-xs leading-relaxed" style={{ color: "#C4C4D4" }}>
                  Ahmet Bey'in sadakat skoru düşük ve 2. kez olumsuz deneyim yaşıyor. <strong className="text-white">%10 indirim kuponu</strong> sunulması müşteriyi elde tutmak için etkili olabilir.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { icon: "🎁", label: "İndirim Kuponu Gönder", danger: false },
                  { icon: "⭐", label: "Öncelikli Müşteri Yap", danger: false },
                  { icon: "🚩", label: "Risk Olarak İşaretle",  danger: true  },
                ].map((btn) => (
                  <button key={btn.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left cursor-pointer w-full"
                    style={{
                      border: btn.danger ? "1px solid rgba(239,68,68,0.3)" : "1px solid #2A2A38",
                      background: btn.danger ? "rgba(239,68,68,0.06)" : "#111118",
                      color: btn.danger ? "#EF4444" : "#C4C4D4",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                    <span>{btn.icon}</span> {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}