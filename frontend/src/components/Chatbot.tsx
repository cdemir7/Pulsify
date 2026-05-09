import { useState } from "react";
import Sidebar from './Sidebar'
 
const initialMessages = [
  {
    id: 1,
    role: "customer",
    text: "Merhaba, siparişim nerede? 3 gündür bekliyorum.",
    time: "10:24",
  },
  {
    id: 2,
    role: "ai",
    text: "Merhaba Ahmet Bey, anlıyorum. Siparişiniz #1234 kargoya verildi. Tahmini teslimat yarın olarak görünüyor.",
    time: "10:24",
    tracking: "TRK884521",
  },
  {
    id: 3,
    role: "customer",
    text: "Neden bu kadar geç? Daha önce bu kadar beklemedim. Çok sinir bozucu.",
    time: "10:25",
  },
  {
    id: 4,
    role: "ai",
    text: "Haklısınız Ahmet Bey, bu gecikme için özür dileriz. Kargo sürecinde beklenmedik bir yoğunluk yaşandı. Ekibimiz bilgilendirildi ve siparişiniz öncelikli olarak işaretlendi.",
    time: "10:25",
  },
  {
    id: 5,
    role: "customer",
    text: "Tamam, yarın gelirse iyi. Ama bir daha böyle olursa almam.",
    time: "10:26",
  },
];
 
const quickReplies = ["Özür dile", "Kargo bilgisi ver", "İndirim teklif et", "Yönlendir"];
 
const sentimentHistory = [
  { dot: "bg-red-500", text: "Sinirli — kargo gecikmesi", date: "Bugün" },
  { dot: "bg-gray-500", text: "Nötr — ürün sorusu", date: "3 gün" },
  { dot: "bg-emerald-500", text: "Mutlu — hızlı teslimat", date: "12 gün" },
  { dot: "bg-emerald-500", text: "Mutlu — ürün beğendi", date: "1 ay" },
];
 
export default function Chatbot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
 
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: "customer", text: input, time: "Şimdi" },
    ]);
    setInput("");
  };
 
  const handleCopy = () => {
    navigator.clipboard.writeText("TRK884521");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}
    >
      <Sidebar />
 
      {/* Main */}
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
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
          {/* Chat Area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 shrink-0" style={{ background: "#0D0D14", borderBottom: "1px solid #1E1E2E" }}>
              <div className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold text-red-400" style={{ background: "rgba(239,68,68,0.2)" }}>AY</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Ahmet Yılmaz</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs" style={{ color: "#6B7280" }}>Sipariş #1234 · 8 sipariş geçmişi</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-red-400" style={{ background: "rgba(239,68,68,0.15)" }}>
                    😠 Sinirli
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
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2.5 items-start">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-xs font-bold ${msg.role === "customer" ? "text-red-400" : "text-indigo-400"}`}
                    style={{ background: msg.role === "customer" ? "rgba(239,68,68,0.2)" : "rgba(99,102,241,0.2)" }}>
                    {msg.role === "customer" ? "AY" : "✦"}
                  </div>
                  <div className="flex flex-col gap-1 max-w-[75%]">
                    <span className="text-[11px] font-medium" style={{ color: "#4A4A5E" }}>
                      {msg.role === "customer" ? "Ahmet Yılmaz" : "✦ AI Asistan"} · {msg.time}
                    </span>
                    <div
                      className="px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed relative overflow-hidden"
                      style={{
                        background: msg.role === "customer" ? "#1A1A24" : "#0F0F1A",
                        border: msg.role === "customer" ? "1px solid #2A2A38" : "1px solid rgba(99,102,241,0.25)",
                        color: "#C4C4D4",
                        borderTopLeftRadius: "4px",
                      }}
                    >
                      {msg.text}
                      {msg.tracking && (
                        <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-lg" style={{ background: "#1A1A24", border: "1px solid #2A2A38" }}>
                          <span className="text-xs" style={{ color: "#8B8B9E" }}>Takip:</span>
                          <span className="text-xs font-semibold font-mono text-indigo-400">{msg.tracking}</span>
                          <button onClick={handleCopy} className="ml-auto text-xs px-2 py-0.5 rounded" style={{ color: copied ? "#10B981" : "#4A4A5E" }}>
                            {copied ? "✓ Kopyalandı" : "Kopyala"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
 
            {/* Alert Banner */}
            <div className="mx-5 mb-3 px-3.5 py-2.5 rounded-xl flex items-center gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <span className="text-red-400 text-base">⚠️</span>
              <p className="flex-1 text-xs" style={{ color: "#C4C4D4" }}>
                <strong className="text-red-400">Duygu uyarısı:</strong> Ahmet Yılmaz sinirli olarak işaretlendi. Dashboard'a uyarı düştü.
              </p>
              <span className="text-xs text-indigo-400 font-semibold cursor-pointer whitespace-nowrap">Dashboard'da Gör →</span>
            </div>
 
            {/* Input */}
            <div className="px-5 pb-5 shrink-0" style={{ borderTop: "1px solid #1E1E2E", paddingTop: "14px" }}>
              <div className="flex gap-2 mb-2.5 flex-wrap">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-1 rounded-full text-xs transition-all cursor-pointer"
                    style={{ border: "1px solid #2A2A38", background: "#111118", color: "#8B8B9E" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex gap-2.5 items-end">
                <textarea
                  className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px] outline-none resize-none text-white"
                  style={{ background: "#111118", border: "1px solid #2A2A38", fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "42px", maxHeight: "100px", color: "#F1F1F5" }}
                  placeholder="Mesaj yaz veya AI'ın devam etmesini bekle..."
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <button
                  onClick={handleSend}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500 text-white shrink-0 text-base transition-all hover:bg-indigo-600"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
 
          {/* Side Panel */}
          <div className="w-72 shrink-0 flex flex-col overflow-y-auto" style={{ borderLeft: "1px solid #1E1E2E", background: "#0D0D14" }}>
            {/* Müşteri Bilgisi */}
            <div className="px-4 py-4" style={{ borderBottom: "1px solid #1E1E2E" }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4A4A5E" }}>Müşteri Bilgisi</p>
              {[
                { label: "Ad", value: "Ahmet Yılmaz", mono: false },
                { label: "Telefon", value: "0532 XXX XX 34", mono: false },
                { label: "Sipariş", value: "#1234", mono: true },
                { label: "Durum", value: "Gecikiyor", color: "#EF4444" },
                { label: "Tutar", value: "₺450", mono: false },
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
 
            {/* Duygu Geçmişi */}
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
 
            {/* AI Önerisi */}
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
                  { icon: "🚩", label: "Risk Olarak İşaretle", danger: true },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-all cursor-pointer w-full"
                    style={{
                      border: btn.danger ? "1px solid rgba(239,68,68,0.3)" : "1px solid #2A2A38",
                      background: btn.danger ? "rgba(239,68,68,0.06)" : "#111118",
                      color: btn.danger ? "#EF4444" : "#C4C4D4",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
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