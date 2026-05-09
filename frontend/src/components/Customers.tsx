import { useState } from "react";
 
const allCustomers = [
  { initials: "AY", name: "Ahmet Yılmaz",  phone: "0532 XXX 34", avatarBg: "rgba(239,68,68,0.15)",  avatarText: "#EF4444", loyalty: 42,  sentiment: "😠", orders: 8,  lastOrder: "Bugün",  segment: "risk"   },
  { initials: "FK", name: "Fatma Kaya",    phone: "0545 XXX 87", avatarBg: "rgba(16,185,129,0.15)", avatarText: "#10B981", loyalty: 87,  sentiment: "😊", orders: 24, lastOrder: "Bugün",  segment: "vip"    },
  { initials: "AR", name: "Ali Rıza",      phone: "0501 XXX 12", avatarBg: "rgba(107,114,128,0.15)",avatarText: "#8B8B9E", loyalty: 61,  sentiment: "😐", orders: 5,  lastOrder: "8 May",  segment: "normal" },
  { initials: "ZA", name: "Zeynep Arslan", phone: "0542 XXX 90", avatarBg: "rgba(239,68,68,0.15)",  avatarText: "#EF4444", loyalty: 38,  sentiment: "😠", orders: 3,  lastOrder: "7 May",  segment: "risk"   },
  { initials: "MS", name: "Mehmet Şahin",  phone: "0538 XXX 44", avatarBg: "rgba(16,185,129,0.15)", avatarText: "#10B981", loyalty: 92,  sentiment: "😊", orders: 31, lastOrder: "7 May",  segment: "vip"    },
  { initials: "CY", name: "Can Yıldız",    phone: "0530 XXX 23", avatarBg: "rgba(99,102,241,0.15)", avatarText: "#6366F1", loyalty: 55,  sentiment: "😐", orders: 2,  lastOrder: "9 May",  segment: "new"    },
];
 
const tabs = [
  { key: "all",     label: "Tümü",    count: 247 },
  { key: "vip",     label: "VIP",     count: 38  },
  { key: "risk",    label: "Risk",    count: 2   },
  { key: "new",     label: "Yeni",    count: 12  },
  { key: "angry",   label: "Sinirli", count: 18  },
];
 
const segmentConfig: Record<string, { label: string; text: string; bg: string }> = {
  vip:    { label: "VIP",    text: "text-indigo-400", bg: "bg-indigo-500/10" },
  risk:   { label: "Risk",   text: "text-red-400",    bg: "bg-red-500/10"    },
  normal: { label: "Normal", text: "text-gray-400",   bg: "bg-gray-500/10"   },
  new:    { label: "Yeni",   text: "text-emerald-400",bg: "bg-emerald-500/10"},
};
 
const insights = [
  { text: <><strong className="text-white">Ahmet Yılmaz</strong> son 2 siparişinde gecikme yaşadı. %10 indirim kuponu elde tutmak için etkili olabilir.</> },
  { text: <><strong className="text-white">Fatma Kaya</strong> ve <strong className="text-white">Mehmet Şahin</strong> VIP segment. Sadakat programına dahil edilmesi önerilir.</> },
  { text: <><strong className="text-white">Can Yıldız</strong> yeni müşteri — ikinci siparişi tamamlandığında otomatik teşekkür mesajı gönderilmesi önerilir.</> },
];
 
export default function Customers() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
 
  const filtered = allCustomers.filter((c) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "vip"   && c.segment === "vip")   ||
      (activeTab === "risk"  && c.segment === "risk")  ||
      (activeTab === "new"   && c.segment === "new")   ||
      (activeTab === "angry" && c.sentiment === "😠");
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchTab && matchSearch;
  });
 
  const getLoyaltyColor = (score: number) => {
    if (score >= 80) return { bar: "#10B981", text: "#10B981" };
    if (score >= 50) return { bar: "#F59E0B", text: "#F59E0B" };
    return { bar: "#EF4444", text: "#EF4444" };
  };
 
  const riskCustomers = allCustomers.filter((c) => c.segment === "risk");
 
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
            { label: "Kargo",      icon: "🚚", active: false, badge: "!"  },
            { label: "Müşteriler", icon: "👥", active: true,  badge: null },
          ].map((item) => (
            <div key={item.label} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] transition-all ${item.active ? "bg-indigo-500/15 text-indigo-400 font-semibold" : "text-[#8B8B9E] hover:bg-white/5 hover:text-white"}`}>
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
            <h1 className="text-lg font-bold tracking-tight">Müşteri Analizi</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4A4A5E" }}>247 müşteri · 18 sinirli · 2 risk altında</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>🔔</button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">DK</div>
          </div>
        </div>
 
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
 
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Toplam Müşteri", value: "247", sub: "↑ 12 bu ay yeni",      icon: "👥", color: "#F1F1F5" },
              { label: "VIP Müşteri",    value: "38",  sub: "Sadakat skoru 80+",    icon: "⭐", color: "#10B981" },
              { label: "Risk Altında",   value: "2",   sub: "Acil ilgi gerekiyor",  icon: "⚠️", color: "#EF4444" },
              { label: "Ort. Sadakat",   value: "67",  sub: "100 üzerinden",        icon: "❤️", color: "#F59E0B" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-medium" style={{ color: "#6B7280" }}>{stat.label}</span>
                  <span className="text-base">{stat.icon}</span>
                </div>
                <p className="text-[26px] font-bold tracking-tight mb-1" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{stat.sub}</p>
              </div>
            ))}
          </div>
 
          {/* Main Grid */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 280px" }}>
            <div className="flex flex-col gap-3">
              {/* Tabs + Search */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex gap-0.5 p-1 rounded-xl" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition-all cursor-pointer ${activeTab === tab.key ? "font-semibold text-white" : "text-[#6B7280] hover:text-white"}`}
                      style={{ background: activeTab === tab.key ? "#1A1A24" : "none", fontFamily: "'Plus Jakarta Sans', sans-serif", border: "none" }}
                    >
                      {tab.label}
                      <span className={`text-[11px] px-1.5 py-0.5 rounded ${(tab.key === "risk" || tab.key === "angry") ? "text-red-400 bg-red-500/15" : activeTab === tab.key ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-[#6B7280]"}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 h-9 rounded-lg" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                    <span className="text-[#4A4A5E] text-sm">🔍</span>
                    <input
                      type="text"
                      placeholder="Müşteri ara..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-transparent outline-none text-[13px] text-white w-36"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    />
                  </div>
                  <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-[13px] text-[#8B8B9E]" style={{ background: "#111118", border: "1px solid #1E1E2E", fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer" }}>
                    Filtrele
                  </button>
                </div>
              </div>
 
              {/* Table */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: "#0F0F16", borderBottom: "1px solid #1A1A24" }}>
                      {["Müşteri", "Sadakat", "Duygu", "Sipariş", "Son Sipariş", "Segment", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#4A4A5E" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => {
                      const lc = getLoyaltyColor(c.loyalty);
                      const seg = segmentConfig[c.segment];
                      return (
                        <tr key={c.name} className="cursor-pointer hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid #1A1A24" }}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold shrink-0" style={{ background: c.avatarBg, color: c.avatarText }}>{c.initials}</div>
                              <div>
                                <p className="text-[13px] font-medium text-white">{c.name}</p>
                                <p className="text-[11px]" style={{ color: "#4A4A5E" }}>{c.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5 min-w-[110px]">
                              <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1A1A24" }}>
                                <div className="h-full rounded-full transition-all" style={{ width: `${c.loyalty}%`, background: lc.bar }} />
                              </div>
                              <span className="text-xs font-semibold min-w-[28px] text-right" style={{ color: lc.text }}>{c.loyalty}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-lg">{c.sentiment}</td>
                          <td className="px-4 py-3 text-[13px] font-medium text-white">{c.orders}</td>
                          <td className="px-4 py-3 text-[13px]" style={{ color: "#6B7280" }}>{c.lastOrder}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold ${seg.bg} ${seg.text}`}>
                              {seg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {["👁", "💬"].map((icon) => (
                                <button key={icon} className="flex items-center justify-center w-7 h-7 rounded-lg text-sm transition-all hover:text-indigo-400" style={{ border: "1px solid #2A2A38", background: "none", color: "#6B7280", cursor: "pointer" }}>
                                  {icon}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
 
            {/* Right Panel */}
            <div className="flex flex-col gap-4">
              {/* Risk Card */}
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div className="flex items-center gap-2 px-4 py-3.5" style={{ borderBottom: "1px solid rgba(239,68,68,0.15)" }}>
                  <span className="text-red-400">⚠️</span>
                  <span className="text-[13px] font-semibold text-red-400 flex-1">Risk Altındaki Müşteriler</span>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  {riskCustomers.map((c) => (
                    <div key={c.name} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold text-red-400 shrink-0" style={{ background: "rgba(239,68,68,0.15)" }}>{c.initials}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate">{c.name}</p>
                        <p className="text-[11px]" style={{ color: "#6B7280" }}>Sadakat: {c.loyalty}/100</p>
                      </div>
                      <span className="text-[10px] font-semibold text-red-400 px-1.5 py-0.5 rounded shrink-0" style={{ background: "rgba(239,68,68,0.15)" }}>Sinirli</span>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* AI Insight */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#0F0F1A", border: "1px solid rgba(99,102,241,0.25)" }}>
                <div className="flex items-center gap-2 px-4 py-3.5" style={{ borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
                  <span className="text-indigo-400">✦</span>
                  <span className="text-[13px] font-semibold text-indigo-400 flex-1">AI Müşteri Analizi</span>
                </div>
                <div className="px-4 py-4 flex flex-col gap-3">
                  {insights.map((item, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <p className="text-xs leading-relaxed" style={{ color: "#C4C4D4" }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Segments */}
              <div className="rounded-xl p-4" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4A4A5E" }}>Müşteri Segmentleri</p>
                {[
                  { label: "VIP",    pct: 15, color: "#10B981" },
                  { label: "Normal", pct: 68, color: "#6366F1" },
                  { label: "Yeni",   pct: 12, color: "#F59E0B" },
                  { label: "Risk",   pct: 5,  color: "#EF4444" },
                ].map((seg) => (
                  <div key={seg.label} className="flex items-center gap-3 mb-3 last:mb-0">
                    <span className="text-xs w-14 shrink-0" style={{ color: seg.color }}>{seg.label}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1A1A24" }}>
                      <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, background: seg.color }} />
                    </div>
                    <span className="text-xs font-semibold text-white w-8 text-right">%{seg.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}