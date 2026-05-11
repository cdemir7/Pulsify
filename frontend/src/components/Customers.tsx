import { useState, useEffect } from "react";
import Sidebar from './Sidebar'
import api from '../api/index'
import CustomerDetailModal from './CustomerDetailModal'
 
interface SentimentHistory {
  sentiment: string;
  date: string;
  message_ref: string;
}
 
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyalty_score: number;
  sentiment: string;
  sentiment_history: SentimentHistory[];
  total_orders: number;
  last_order_date?: string;
  total_spent: number;
}
 
interface Stats {
  total: number;
  vip: number;
  risk: number;
  angry: number;
}
 
const tabs = [
  { key: "all",   label: "Tümü",    countKey: "total" },
  { key: "vip",   label: "VIP",     countKey: "vip"   },
  { key: "risk",  label: "Risk",    countKey: "risk"  },
  { key: "angry", label: "Sinirli", countKey: "angry" },
];
 
const segmentConfig: Record<string, { label: string; text: string; bg: string }> = {
  vip:    { label: "VIP",    text: "text-indigo-400",  bg: "bg-indigo-500/10"  },
  risk:   { label: "Risk",   text: "text-red-400",     bg: "bg-red-500/10"     },
  normal: { label: "Normal", text: "text-gray-400",    bg: "bg-gray-500/10"    },
  new:    { label: "Yeni",   text: "text-emerald-400", bg: "bg-emerald-500/10" },
};
 
const getSegment = (customer: Customer): string => {
  if (customer.loyalty_score >= 80) return "vip";
  if (customer.sentiment === "angry" && customer.loyalty_score < 50) return "risk";
  if (customer.total_orders <= 2) return "new";
  return "normal";
};
 
const getSentimentEmoji = (sentiment: string) => {
  if (sentiment === "happy") return "😊";
  if (sentiment === "angry") return "😠";
  return "😐";
};
 
const getLoyaltyColor = (score: number) => {
  if (score >= 80) return { bar: "#10B981", text: "#10B981" };
  if (score >= 50) return { bar: "#F59E0B", text: "#F59E0B" };
  return { bar: "#EF4444", text: "#EF4444" };
};
 
export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [riskCustomers, setRiskCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, vip: 0, risk: 0, angry: 0 });
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
 
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [customersRes, riskRes, statsRes] = await Promise.all([
        api.get("/api/customers/"),
        api.get("/api/customers/risk"),
        api.get("/api/customers/stats"),
      ]);
      setCustomers(customersRes.data.data);
      setRiskCustomers(riskRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error("Veri yüklenemedi:", err);
    } finally {
      setIsLoading(false);
    }
  };
 
  const filtered = customers.filter((c) => {
    const segment = getSegment(c);
    const matchTab =
      activeTab === "all" ||
      (activeTab === "vip"   && segment === "vip")   ||
      (activeTab === "risk"  && segment === "risk")  ||
      (activeTab === "angry" && c.sentiment === "angry");
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchTab && matchSearch;
  });
 
  const getTabCount = (key: string) => {
    if (key === "total") return stats.total;
    if (key === "vip")   return stats.vip;
    if (key === "risk")  return stats.risk;
    if (key === "angry") return stats.angry;
    return 0;
  };
 
  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}>
      <Sidebar />
      <main className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ background: "#0A0A0F", borderBottom: "1px solid #1E1E2E" }}>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Müşteri Analizi</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4A4A5E" }}>
              {stats.total} müşteri · {stats.angry} sinirli · {stats.risk} risk altında
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>🔔</button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">DK</div>
          </div>
        </div>
 
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Toplam Müşteri", value: stats.total, sub: "Kayıtlı müşteri",     icon: "👥", color: "#F1F1F5" },
              { label: "VIP Müşteri",    value: stats.vip,   sub: "Sadakat skoru 80+",   icon: "⭐", color: "#10B981" },
              { label: "Risk Altında",   value: stats.risk,  sub: "Acil ilgi gerekiyor", icon: "⚠️", color: "#EF4444" },
              { label: "Sinirli",        value: stats.angry, sub: "Olumsuz duygu",       icon: "😠", color: "#F59E0B" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-medium" style={{ color: "#6B7280" }}>{stat.label}</span>
                  <span className="text-base">{stat.icon}</span>
                </div>
                <p className="text-[26px] font-bold tracking-tight mb-1" style={{ color: stat.color }}>
                  {isLoading ? "..." : stat.value}
                </p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{stat.sub}</p>
              </div>
            ))}
          </div>
 
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 280px" }}>
            <div className="flex flex-col gap-3">
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
                        {getTabCount(tab.countKey)}
                      </span>
                    </button>
                  ))}
                </div>
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
              </div>
 
              <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                {isLoading ? (
                  <div className="flex items-center justify-center py-16" style={{ color: "#4A4A5E" }}>
                    <p>Yükleniyor...</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ background: "#0F0F16", borderBottom: "1px solid #1A1A24" }}>
                        {["Müşteri", "Sadakat", "Duygu", "Sipariş", "Harcama", "Segment", ""].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#4A4A5E" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c) => {
                        const lc = getLoyaltyColor(c.loyalty_score);
                        const segment = getSegment(c);
                        const seg = segmentConfig[segment];
                        return (
                          <tr key={c.id} className="cursor-pointer hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid #1A1A24" }}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold shrink-0"
                                  style={{ background: c.sentiment === "angry" ? "rgba(239,68,68,0.15)" : c.sentiment === "happy" ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)", color: c.sentiment === "angry" ? "#EF4444" : c.sentiment === "happy" ? "#10B981" : "#8B8B9E" }}>
                                  {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-[13px] font-medium text-white">{c.name}</p>
                                  <p className="text-[11px]" style={{ color: "#4A4A5E" }}>{c.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5 min-w-[110px]">
                                <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1A1A24" }}>
                                  <div className="h-full rounded-full" style={{ width: `${c.loyalty_score}%`, background: lc.bar }} />
                                </div>
                                <span className="text-xs font-semibold min-w-[28px] text-right" style={{ color: lc.text }}>{c.loyalty_score}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-lg">{getSentimentEmoji(c.sentiment)}</td>
                            <td className="px-4 py-3 text-[13px] font-medium text-white">{c.total_orders}</td>
                            <td className="px-4 py-3 text-[13px]" style={{ color: "#C4C4D4" }}>₺{c.total_spent.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold ${seg.bg} ${seg.text}`}>
                                {seg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setSelectedCustomer(c)}
                                  className="flex items-center justify-center w-7 h-7 rounded-lg text-sm transition-all hover:text-indigo-400"
                                  style={{ border: "1px solid #2A2A38", background: "none", color: "#6B7280", cursor: "pointer" }}
                                >
                                  👁
                                </button>
                                <button
                                  className="flex items-center justify-center w-7 h-7 rounded-lg text-sm"
                                  style={{ border: "1px solid #2A2A38", background: "none", color: "#6B7280", cursor: "pointer" }}
                                >
                                  💬
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
 
            <div className="flex flex-col gap-4">
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div className="flex items-center gap-2 px-4 py-3.5" style={{ borderBottom: "1px solid rgba(239,68,68,0.15)" }}>
                  <span className="text-red-400">⚠️</span>
                  <span className="text-[13px] font-semibold text-red-400 flex-1">Risk Altındaki Müşteriler</span>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  {isLoading ? (
                    <p className="text-xs text-center py-4" style={{ color: "#4A4A5E" }}>Yükleniyor...</p>
                  ) : riskCustomers.length === 0 ? (
                    <p className="text-xs text-center py-4" style={{ color: "#4A4A5E" }}>Risk altında müşteri yok 🎉</p>
                  ) : riskCustomers.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer"
                      style={{ background: "#111118", border: "1px solid #1E1E2E" }}
                      onClick={() => setSelectedCustomer(c)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold text-red-400 shrink-0" style={{ background: "rgba(239,68,68,0.15)" }}>
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate">{c.name}</p>
                        <p className="text-[11px]" style={{ color: "#6B7280" }}>Sadakat: {c.loyalty_score}/100</p>
                      </div>
                      <span className="text-[10px] font-semibold text-red-400 px-1.5 py-0.5 rounded shrink-0" style={{ background: "rgba(239,68,68,0.15)" }}>Sinirli</span>
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="rounded-xl p-4" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4A4A5E" }}>Müşteri Segmentleri</p>
                {[
                  { label: "VIP",    value: stats.vip,  color: "#10B981" },
                  { label: "Normal", value: stats.total - stats.vip - stats.risk, color: "#6366F1" },
                  { label: "Risk",   value: stats.risk, color: "#EF4444" },
                ].map((seg) => {
                  const pct = stats.total > 0 ? Math.round((seg.value / stats.total) * 100) : 0;
                  return (
                    <div key={seg.label} className="flex items-center gap-3 mb-3 last:mb-0">
                      <span className="text-xs w-14 shrink-0" style={{ color: seg.color }}>{seg.label}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1A1A24" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: seg.color }} />
                      </div>
                      <span className="text-xs font-semibold text-white w-8 text-right">%{pct}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
 
        {selectedCustomer && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </main>
    </div>
  );
}