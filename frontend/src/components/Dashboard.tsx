const stats = [
  {
    label: "Toplam Sipariş",
    value: "247",
    trend: "↑ %12 dünden fazla",
    trendType: "up",
    icon: "📦",
    color: "indigo",
  },
  {
    label: "Geciken Kargo",
    value: "3",
    trend: "↑ 1 artış — dün 2'ydi",
    trendType: "down",
    icon: "🚚",
    color: "red",
  },
  {
    label: "Memnuniyet",
    value: "%91",
    trend: "↓ %3 düştü",
    trendType: "down",
    icon: "😊",
    color: "green",
  },
  {
    label: "Kritik Stok",
    value: "2",
    trend: "Değişmedi",
    trendType: "neutral",
    icon: "⚠️",
    color: "amber",
  },
];
 
const orders = [
  { id: "#1234", customer: "Ahmet Yılmaz", product: "Ürün A", amount: "₺450", status: "delayed", sentiment: "😠" },
  { id: "#1235", customer: "Fatma Kaya", product: "Ürün B", amount: "₺280", status: "delivered", sentiment: "😊" },
  { id: "#1236", customer: "Ali Rıza", product: "Ürün C", amount: "₺920", status: "processing", sentiment: "😐" },
  { id: "#1237", customer: "Ayşe Demir", product: "Ürün D", amount: "₺165", status: "cancelled", sentiment: "😐" },
  { id: "#1238", customer: "Mehmet Şahin", product: "Ürün A", amount: "₺340", status: "delivered", sentiment: "😊" },
];
 
const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  delivered:  { label: "Teslim",    dot: "bg-emerald-500",  text: "text-emerald-400", bg: "bg-emerald-500/10" },
  delayed:    { label: "Gecikiyor", dot: "bg-red-500 animate-pulse", text: "text-red-400",     bg: "bg-red-500/10"     },
  processing: { label: "İşlemde",   dot: "bg-indigo-500",   text: "text-indigo-400",  bg: "bg-indigo-500/10"  },
  cancelled:  { label: "İptal",     dot: "bg-gray-500",     text: "text-gray-400",    bg: "bg-gray-500/10"    },
};
 
const sentiments = [
  { emoji: "😊", label: "Mutlu",  count: 182, pct: 74, bar: "bg-emerald-500" },
  { emoji: "😐", label: "Nötr",   count: 47,  pct: 19, bar: "bg-gray-500"    },
  { emoji: "😠", label: "Sinirli",count: 18,  pct: 7,  bar: "bg-red-500"     },
];
 
const riskCustomers = [
  { initials: "AY", name: "Ahmet Yılmaz", score: 42 },
  { initials: "ZA", name: "Zeynep Arslan", score: 38 },
];
 
const statColorMap: Record<string, { iconBg: string; iconText: string; valueColor: string }> = {
  indigo: { iconBg: "bg-indigo-500/15", iconText: "text-indigo-400", valueColor: "text-white"         },
  red:    { iconBg: "bg-red-500/15",    iconText: "text-red-400",    valueColor: "text-red-400"        },
  green:  { iconBg: "bg-emerald-500/15",iconText: "text-emerald-400",valueColor: "text-white"          },
  amber:  { iconBg: "bg-amber-500/15",  iconText: "text-amber-400",  valueColor: "text-amber-400"      },
};
 
export default function Dashboard() {
  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col w-56 shrink-0"
        style={{ background: "#0D0D14", borderRight: "1px solid #1E1E2E" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid #1E1E2E" }}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-base tracking-tight">Pulsify</span>
        </div>
 
        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 px-2.5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 pt-2 pb-1.5" style={{ color: "#4A4A5E" }}>
            Ana Menü
          </p>
          {[
            { label: "Dashboard",   icon: "▦",  active: true,  badge: null },
            { label: "AI Asistan",  icon: "🤖", active: false, badge: "3"  },
            { label: "Siparişler",  icon: "📦", active: false, badge: null },
            { label: "Kargo",       icon: "🚚", active: false, badge: "!"  },
            { label: "Müşteriler",  icon: "👥", active: false, badge: null },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] transition-all ${
                item.active
                  ? "bg-indigo-500/15 text-indigo-400 font-semibold"
                  : "text-[#8B8B9E] hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
 
          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 pt-4 pb-1.5" style={{ color: "#4A4A5E" }}>
            Sistem
          </p>
          {["Raporlar", "Ayarlar"].map((label) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] text-[#8B8B9E] hover:bg-white/5 hover:text-white transition-all"
            >
              <span>{label === "Raporlar" ? "📊" : "⚙️"}</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>
 
        {/* User */}
        <div className="px-2.5 py-3" style={{ borderTop: "1px solid #1E1E2E" }}>
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-[11px] font-bold shrink-0">
              DK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">Duru K.</p>
              <p className="text-[11px]" style={{ color: "#4A4A5E" }}>Yönetici</p>
            </div>
            <span className="text-[#4A4A5E] text-sm">···</span>
          </div>
        </div>
      </aside>
 
      {/* Main */}
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ background: "#0A0A0F", borderBottom: "1px solid #1E1E2E" }}
        >
          <div>
            <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4A4A5E" }}>
              Günaydın, Duru — 9 Mayıs 2026, Cumartesi
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280] transition-all hover:text-white"
              style={{ background: "#111118", border: "1px solid #1E1E2E" }}
            >
              🔔
            </button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold cursor-pointer">
              DK
            </div>
          </div>
        </div>
 
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
 
          {/* AI Card */}
          <div
            className="flex items-start gap-4 px-5 py-4 rounded-xl relative overflow-hidden"
            style={{
              background: "#0F0F1A",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5"
              style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}
            >
              <span className="text-indigo-400 text-base">✦</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400 mb-1.5">
                AI Operasyon Özeti
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "#C4C4D4" }}>
                Bugün <strong className="text-white">247 aktif sipariş</strong> var.{" "}
                <strong className="text-white">3 kargo gecikiyor</strong> — Ahmet Yılmaz ve 2 müşteri daha risk altında.
                Stokta <strong className="text-white">Ürün C kritik seviyede</strong> (4 adet kaldı).
                Müşteri memnuniyeti dünden <strong className="text-white">%3 düştü</strong>, acil aksiyon önerilir.
              </p>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px]" style={{ color: "#4A4A5E" }}>⏱ 09:00'da üretildi</span>
                <span className="text-[12px] text-indigo-400 font-semibold cursor-pointer">Detaylar →</span>
              </div>
            </div>
          </div>
 
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => {
              const colors = statColorMap[stat.color];
              return (
                <div
                  key={stat.label}
                  className="rounded-xl p-4 cursor-pointer transition-all hover:border-white/10"
                  style={{ background: "#111118", border: "1px solid #1E1E2E" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium" style={{ color: "#6B7280" }}>{stat.label}</span>
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${colors.iconBg} ${colors.iconText} text-sm`}>
                      {stat.icon}
                    </div>
                  </div>
                  <p className={`text-[26px] font-bold leading-none mb-1.5 tracking-tight ${colors.valueColor}`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs ${stat.trendType === "up" && stat.color !== "red" ? "text-emerald-400" : stat.trendType === "down" ? "text-red-400" : "text-[#6B7280]"}`}>
                    {stat.trend}
                  </p>
                </div>
              );
            })}
          </div>
 
          {/* Bottom Grid */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
            {/* Orders Table */}
            <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
              <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #1E1E2E" }}>
                <span className="text-sm font-semibold">Son Siparişler</span>
                <span className="text-xs text-indigo-400 font-medium cursor-pointer">Tümünü Gör →</span>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1A1A24", background: "#0F0F16" }}>
                    {["Sipariş", "Müşteri", "Ürün", "Tutar", "Durum"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#4A4A5E" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const s = statusConfig[order.status];
                    return (
                      <tr
                        key={order.id}
                        className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                        style={{ borderBottom: "1px solid #1A1A24" }}
                      >
                        <td className="px-5 py-3 font-mono text-xs" style={{ color: "#6B7280" }}>{order.id}</td>
                        <td className="px-5 py-3 text-sm font-medium text-white">{order.customer}</td>
                        <td className="px-5 py-3 text-sm" style={{ color: "#C4C4D4" }}>{order.product}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-white">{order.amount}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold ${s.bg} ${s.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
 
            {/* Sentiment + Risk */}
            <div className="flex flex-col gap-4">
              {/* Sentiment */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #1E1E2E" }}>
                  <span className="text-sm font-semibold">Müşteri Duygu Analizi</span>
                  <span className="text-xs text-indigo-400 font-medium cursor-pointer">Detay →</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3.5">
                  {sentiments.map((s) => (
                    <div key={s.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] flex items-center gap-2" style={{ color: "#C4C4D4" }}>
                          <span>{s.emoji}</span> {s.label}
                        </span>
                        <span className="text-[13px] font-semibold text-white">{s.count} (%{s.pct})</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "#1A1A24" }}>
                        <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
 
                {/* Risk */}
                <div className="px-5 pb-4" style={{ borderTop: "1px solid #1E1E2E", paddingTop: "14px" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-red-400 mb-2.5">
                    ⚠ Risk Altındaki Müşteriler
                  </p>
                  <div className="flex flex-col gap-2">
                    {riskCustomers.map((c) => (
                      <div
                        key={c.name}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer"
                        style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold text-red-400"
                          style={{ background: "rgba(239,68,68,0.2)" }}>
                          {c.initials}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-white">{c.name}</p>
                          <p className="text-[11px]" style={{ color: "#6B7280" }}>Sadakat: {c.score}/100</p>
                        </div>
                        <span className="text-[10px] font-semibold text-red-400 px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(239,68,68,0.15)" }}>
                          Sinirli
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}