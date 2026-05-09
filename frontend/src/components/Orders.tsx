import { useState } from "react";
 
const allOrders = [
  { id: "#1234", customer: "Ahmet Yılmaz", initials: "AY", avatarColor: "rgba(239,68,68,0.15)", avatarText: "#EF4444", phone: "0532 XXX 34", product: "Ürün A", amount: "₺450", status: "delayed",    tracking: "TRK884521", sentiment: "😠", date: "9 May" },
  { id: "#1235", customer: "Fatma Kaya",   initials: "FK", avatarColor: "rgba(16,185,129,0.15)", avatarText: "#10B981", phone: "0545 XXX 87", product: "Ürün B", amount: "₺280", status: "delivered",  tracking: "TRK773412", sentiment: "😊", date: "9 May" },
  { id: "#1236", customer: "Ali Rıza",     initials: "AR", avatarColor: "rgba(107,114,128,0.15)",avatarText: "#8B8B9E", phone: "0501 XXX 12", product: "Ürün C", amount: "₺920", status: "processing", tracking: "—",         sentiment: "😐", date: "8 May" },
  { id: "#1237", customer: "Ayşe Demir",   initials: "AD", avatarColor: "rgba(107,114,128,0.15)",avatarText: "#6B7280", phone: "0555 XXX 61", product: "Ürün D", amount: "₺165", status: "cancelled",  tracking: "—",         sentiment: "😐", date: "8 May" },
  { id: "#1238", customer: "Mehmet Şahin", initials: "MS", avatarColor: "rgba(16,185,129,0.15)", avatarText: "#10B981", phone: "0538 XXX 44", product: "Ürün A", amount: "₺340", status: "delivered",  tracking: "TRK661209", sentiment: "😊", date: "7 May" },
  { id: "#1239", customer: "Zeynep Arslan",initials: "ZA", avatarColor: "rgba(245,158,11,0.15)", avatarText: "#F59E0B", phone: "0542 XXX 90", product: "Ürün E", amount: "₺710", status: "delayed",    tracking: "TRK990341", sentiment: "😠", date: "7 May" },
  { id: "#1240", customer: "Can Yıldız",   initials: "CY", avatarColor: "rgba(99,102,241,0.15)", avatarText: "#6366F1", phone: "0530 XXX 23", product: "Ürün B", amount: "₺195", status: "pending",    tracking: "—",         sentiment: "😐", date: "9 May" },
];
 
const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  delivered:  { label: "Teslim",    dot: "bg-emerald-500",              text: "text-emerald-400", bg: "bg-emerald-500/10" },
  delayed:    { label: "Gecikiyor", dot: "bg-red-500 animate-pulse",    text: "text-red-400",     bg: "bg-red-500/10"     },
  processing: { label: "İşlemde",   dot: "bg-indigo-500",               text: "text-indigo-400",  bg: "bg-indigo-500/10"  },
  cancelled:  { label: "İptal",     dot: "bg-gray-500",                 text: "text-gray-400",    bg: "bg-gray-500/10"    },
  pending:    { label: "Bekliyor",  dot: "bg-amber-500",                text: "text-amber-400",   bg: "bg-amber-500/10"   },
};
 
const tabs = [
  { key: "all",        label: "Tümü",      count: 247, countColor: "" },
  { key: "pending",    label: "Bekliyor",  count: 42,  countColor: "" },
  { key: "processing", label: "İşlemde",   count: 118, countColor: "" },
  { key: "delayed",    label: "Gecikiyor", count: 3,   countColor: "text-red-400 bg-red-500/15" },
  { key: "delivered",  label: "Teslim",    count: 78,  countColor: "" },
  { key: "cancelled",  label: "İptal",     count: 6,   countColor: "" },
];
 
export default function Orders() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
 
  const filtered = allOrders.filter((o) => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });
 
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
            { label: "Siparişler", icon: "📦", active: true,  badge: null },
            { label: "Kargo",      icon: "🚚", active: false, badge: "!"  },
            { label: "Müşteriler", icon: "👥", active: false, badge: null },
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
            <h1 className="text-lg font-bold tracking-tight">Siparişler</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4A4A5E" }}>Toplam 247 sipariş — 3 gecikiyor, 2 kritik</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>🔔</button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">DK</div>
            <button className="flex items-center gap-1.5 px-3.5 h-9 rounded-lg bg-indigo-500 text-white text-[13px] font-semibold">
              + Yeni Sipariş
            </button>
          </div>
        </div>
 
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {/* Tabs + Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Tabs */}
            <div className="flex gap-0.5 p-1 rounded-xl" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] transition-all cursor-pointer ${activeTab === tab.key ? "font-semibold text-white" : "text-[#6B7280] hover:text-white"}`}
                  style={{ background: activeTab === tab.key ? "#1A1A24" : "none", fontFamily: "'Plus Jakarta Sans', sans-serif", border: "none" }}
                >
                  {tab.label}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded ${activeTab === tab.key ? "bg-indigo-500/20 text-indigo-400" : tab.countColor || "bg-white/5 text-[#6B7280]"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
 
            {/* Search + Filters */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 h-9 rounded-lg" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <span className="text-[#4A4A5E] text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Sipariş, müşteri ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-[13px] text-white w-44"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              </div>
              {["Filtrele", "Tarih", "Dışa Aktar"].map((btn) => (
                <button key={btn} className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-[13px] text-[#8B8B9E] cursor-pointer" style={{ background: "#111118", border: "1px solid #1E1E2E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {btn}
                </button>
              ))}
            </div>
          </div>
 
          {/* Table */}
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#0F0F16", borderBottom: "1px solid #1A1A24" }}>
                  {["Sipariş No", "Müşteri", "Ürün", "Tutar", "Durum", "Kargo", "Duygu", "Tarih", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#4A4A5E" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const s = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="cursor-pointer transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #1A1A24" }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#6B7280" }}>{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold shrink-0" style={{ background: order.avatarColor, color: order.avatarText }}>{order.initials}</div>
                          <div>
                            <p className="text-[13px] font-medium text-white">{order.customer}</p>
                            <p className="text-[11px]" style={{ color: "#4A4A5E" }}>{order.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px]" style={{ color: "#C4C4D4" }}>{order.product}</td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-white">{order.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px]" style={{ color: order.tracking === "—" ? "#4A4A5E" : "#6B7280" }}>{order.tracking}</td>
                      <td className="px-4 py-3 text-base">{order.sentiment}</td>
                      <td className="px-4 py-3 text-[13px]" style={{ color: "#6B7280" }}>{order.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {["👁", "💬", "⋮"].map((icon) => (
                            <button key={icon} className="flex items-center justify-center w-7 h-7 rounded-lg text-[13px] transition-all hover:text-indigo-400" style={{ border: "1px solid #2A2A38", background: "none", color: "#6B7280", cursor: "pointer" }}>
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
 
            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid #1A1A24", background: "#0F0F16" }}>
              <span className="text-xs" style={{ color: "#4A4A5E" }}>{filtered.length} / 247 sipariş gösteriliyor</span>
              <div className="flex items-center gap-1">
                {["‹", "1", "2", "3", "...", "13", "›"].map((p, i) => (
                  <button key={i} className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs transition-all ${p === "1" ? "bg-indigo-500 text-white font-semibold" : "text-[#6B7280] hover:text-white"}`}
                    style={{ border: p === "1" ? "none" : "1px solid #2A2A38", background: p === "1" ? "#6366F1" : "none", fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: "pointer" }}>
                    {p}
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