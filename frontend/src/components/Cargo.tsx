import { useState } from "react";
 
const delayedCargos = [
  { tracking: "TRK884521", customer: "Ahmet Yılmaz", initials: "AY", avatarColor: "rgba(239,68,68,0.15)", avatarText: "#EF4444", expected: "7 May", delay: "2 gün", delayLevel: "high", sentiment: "😠", notified: false },
  { tracking: "TRK990341", customer: "Zeynep Arslan", initials: "ZA", avatarColor: "rgba(245,158,11,0.15)", avatarText: "#F59E0B", expected: "6 May", delay: "3 gün", delayLevel: "high", sentiment: "😠", notified: true  },
  { tracking: "TRK551872", customer: "Murat Kılıç",  initials: "MK", avatarColor: "rgba(107,114,128,0.15)",avatarText: "#8B8B9E", expected: "8 May", delay: "1 gün", delayLevel: "mid",  sentiment: "😐", notified: false },
];
 
const timeline = [
  { dot: "bg-red-500",     title: "TRK884521 gecikiyor",    sub: "Ahmet Yılmaz · 2 gün geç",         time: "Bugün, 08:42" },
  { dot: "bg-red-500",     title: "TRK990341 gecikiyor",    sub: "Zeynep Arslan · Bildirim gönderildi", time: "Bugün, 07:15" },
  { dot: "bg-emerald-500", title: "TRK773412 teslim edildi",sub: "Fatma Kaya · Zamanında",            time: "Bugün, 11:30" },
  { dot: "bg-amber-500",   title: "TRK551872 risk altında", sub: "Murat Kılıç · 1 gün geç",          time: "Dün, 18:00"   },
  { dot: "bg-emerald-500", title: "TRK661209 teslim edildi",sub: "Mehmet Şahin · Zamanında",         time: "Dün, 14:22"   },
];
 
const dailyReport = [
  { icon: "📦", label: "Toplam kargo",       value: "128", color: "#F1F1F5"  },
  { icon: "✅", label: "Teslim edildi",       value: "78",  color: "#10B981"  },
  { icon: "⏰", label: "Gecikiyor",           value: "3",   color: "#EF4444"  },
  { icon: "🚚", label: "Yolda",              value: "47",  color: "#6366F1"  },
  { icon: "🔔", label: "Bildirim gönderildi", value: "1",   color: "#F59E0B"  },
];
 
export default function Cargo() {
  const [notifiedList, setNotifiedList] = useState<string[]>(["TRK990341"]);
  const [aiDismissed, setAiDismissed] = useState(false);
  const [allNotified, setAllNotified] = useState(false);
 
  const handleNotify = (tracking: string) => {
    setNotifiedList((prev) => [...prev, tracking]);
  };
 
  const handleNotifyAll = () => {
    setNotifiedList(delayedCargos.map((c) => c.tracking));
    setAllNotified(true);
    setAiDismissed(true);
  };
 
  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}>
      {/* Sidebar */}
      <aside className="flex flex-col w-56 shrink-0" style={{ background: "#0D0D14", borderRight: "1px solid #1E1E2E" }}>
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid #1E1E2E" }}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-base tracking-tight">Pulsify</span>
        </div>
        <nav className="flex flex-col gap-0.5 flex-1 px-2.5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 pt-2 pb-1.5" style={{ color: "#4A4A5E" }}>Ana Menü</p>
          {[
            { label: "Dashboard",  icon: "▦",  active: false, badge: null },
            { label: "AI Asistan", icon: "🤖", active: false, badge: "3"  },
            { label: "Siparişler", icon: "📦", active: false, badge: null },
            { label: "Kargo",      icon: "🚚", active: true,  badge: "!"  },
            { label: "Müşteriler", icon: "👥", active: false, badge: null },
          ].map((item) => (
            <div key={item.label} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] transition-all ${item.active ? "bg-red-500/12 text-red-400 font-semibold" : "text-[#8B8B9E] hover:bg-white/5 hover:text-white"}`}>
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">{item.badge}</span>}
            </div>
          ))}
          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 pt-4 pb-1.5" style={{ color: "#4A4A5E" }}>Sistem</p>
          {["Raporlar", "Ayarlar"].map((label) => (
            <div key={label} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] text-[#8B8B9E] hover:bg-white/5 hover:text-white transition-all">
              <span>{label === "Raporlar" ? "📊" : "⚙️"}</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>
        <div className="px-2.5 py-3" style={{ borderTop: "1px solid #1E1E2E" }}>
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-[11px] font-bold shrink-0">DK</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">Duru K.</p>
              <p className="text-[11px]" style={{ color: "#4A4A5E" }}>Yönetici</p>
            </div>
            <span style={{ color: "#4A4A5E" }}>···</span>
          </div>
        </div>
      </aside>
 
      {/* Main */}
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ background: "#0A0A0F", borderBottom: "1px solid #1E1E2E" }}>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Kargo Yönetimi</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4A4A5E" }}>Gerçek zamanlı kargo takibi ve gecikme uyarıları</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>🔔</button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">DK</div>
          </div>
        </div>
 
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
 
          {/* Alert Bar */}
          <div className="flex items-center gap-4 px-5 py-4 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 text-red-400 text-lg animate-pulse" style={{ background: "rgba(239,68,68,0.15)" }}>⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-400">3 kargo gecikiyor — acil aksiyon gerekli</p>
              <p className="text-xs mt-0.5" style={{ color: "#8B8B9E" }}>Ortalama gecikme 2.3 gün · 2 müşteri sinirli olarak işaretlendi</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="px-3.5 py-2 rounded-lg text-xs font-semibold text-red-400 cursor-pointer" style={{ border: "1px solid rgba(239,68,68,0.4)", background: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Detayları Gör
              </button>
              <button onClick={handleNotifyAll} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer" style={{ background: allNotified ? "#10B981" : "#EF4444", border: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {allNotified ? "✓ Gönderildi" : "➤ Hepsine Bildir"}
              </button>
            </div>
          </div>
 
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Geciken Kargo",    value: "3",   sub: "↑ 1 artış — dün 2'ydi",    icon: "⏰", valueColor: "#EF4444" },
              { label: "Ort. Gecikme",     value: "2.3", sub: "gün ortalama",              icon: "⌛", valueColor: "#F59E0B" },
              { label: "Zamanında Teslim", value: "%94", sub: "↓ %2 geçen haftadan",       icon: "✅", valueColor: "#10B981" },
              { label: "Aktif Kargo",      value: "128", sub: "yolda olan paket",          icon: "🚚", valueColor: "#F1F1F5" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-medium" style={{ color: "#6B7280" }}>{stat.label}</span>
                  <span className="text-base">{stat.icon}</span>
                </div>
                <p className="text-[26px] font-bold tracking-tight mb-1" style={{ color: stat.valueColor }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{stat.sub}</p>
              </div>
            ))}
          </div>
 
          {/* Main Grid */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 280px" }}>
            <div className="flex flex-col gap-4">
              {/* Delayed Table */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #1E1E2E" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Geciken Kargolar</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold text-red-400" style={{ background: "rgba(239,68,68,0.12)" }}>3 acil</span>
                  </div>
                  <span className="text-xs text-indigo-400 font-medium cursor-pointer">Tümünü Gör →</span>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: "#0F0F16", borderBottom: "1px solid #1A1A24" }}>
                      {["Takip No", "Müşteri", "Beklenen", "Gecikme", "Duygu", "Bildirim"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#4A4A5E" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {delayedCargos.map((cargo) => {
                      const isNotified = notifiedList.includes(cargo.tracking);
                      return (
                        <tr key={cargo.tracking} className="cursor-pointer hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid #1A1A24" }}>
                          <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#6B7280" }}>{cargo.tracking}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold" style={{ background: cargo.avatarColor, color: cargo.avatarText }}>{cargo.initials}</div>
                              <span className="text-[13px] text-white font-medium">{cargo.customer}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-[13px]" style={{ color: "#6B7280" }}>{cargo.expected}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold ${cargo.delayLevel === "high" ? "text-red-400 bg-red-500/12" : "text-amber-400 bg-amber-500/12"}`}>
                              ⏱ {cargo.delay}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-base">{cargo.sentiment}</td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => !isNotified && handleNotify(cargo.tracking)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                              style={{
                                border: isNotified ? "1px solid rgba(16,185,129,0.3)" : "1px solid #2A2A38",
                                background: isNotified ? "rgba(16,185,129,0.06)" : "none",
                                color: isNotified ? "#10B981" : "#8B8B9E",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              {isNotified ? "✓ Gönderildi" : "➤ Bildir"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
 
              {/* AI Card */}
              {!aiDismissed && (
                <div className="rounded-xl overflow-hidden" style={{ background: "#0F0F1A", border: "1px solid rgba(99,102,241,0.25)" }}>
                  <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
                    <span className="text-indigo-400 text-base">✦</span>
                    <span className="text-[13px] font-semibold text-indigo-400 flex-1">AI Kargo Raporu — Gemini Önerisi</span>
                    <span className="text-[11px]" style={{ color: "#4A4A5E" }}>09:00'da üretildi</span>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#C4C4D4" }}>
                      <strong className="text-white">3 geciken kargo</strong> tespit edildi. Ahmet Yılmaz ve Zeynep Arslan sinirli olarak işaretlendi — bu müşterilere öncelikli bildirim gönderilmesi önerilir. Murat Kılıç'ın gecikmesi 1 gün olup henüz nötr durumda. <strong className="text-white">Otomatik bildirim</strong> gönderilsin mi?
                    </p>
                    <div className="flex gap-3">
                      <button onClick={handleNotifyAll} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-indigo-500 cursor-pointer" style={{ border: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        ➤ Evet, Hepsine Gönder
                      </button>
                      <button onClick={() => setAiDismissed(true)} className="flex-1 py-2.5 rounded-xl text-[13px] text-[#8B8B9E] cursor-pointer" style={{ border: "1px solid #2A2A38", background: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Hayır, Geç
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
 
            {/* Right Panel */}
            <div className="flex flex-col gap-4">
              {/* Timeline */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #1E1E2E" }}>
                  <span className="text-sm font-semibold">Kargo Zaman Çizelgesi</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-0">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex gap-3 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${item.dot}`} />
                        {i < timeline.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: "#1E1E2E", minHeight: "20px" }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-white">{item.title}</p>
                        <p className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>{item.sub}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "#4A4A5E" }}>{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Daily Report */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #1E1E2E" }}>
                  <span className="text-sm font-semibold">Günlük Rapor</span>
                  <span className="text-[11px]" style={{ color: "#4A4A5E" }}>9 Mayıs 2026</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-2">
                  {dailyReport.map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "#0F0F16" }}>
                      <span className="text-xs flex items-center gap-2" style={{ color: "#8B8B9E" }}>
                        <span>{row.icon}</span> {row.label}
                      </span>
                      <span className="text-[13px] font-semibold" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}