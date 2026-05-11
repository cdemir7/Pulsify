import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { dashboardApi } from '../api/dashboard';
import { cargoApi } from '../api/cargo';
 
const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  delivered:  { label: "Teslim",    dot: "bg-emerald-500",           text: "text-emerald-400", bg: "bg-emerald-500/10" },
  delayed:    { label: "Gecikiyor", dot: "bg-red-500 animate-pulse", text: "text-red-400",     bg: "bg-red-500/10"     },
  processing: { label: "İşlemde",   dot: "bg-indigo-500",            text: "text-indigo-400",  bg: "bg-indigo-500/10"  },
  cancelled:  { label: "İptal",     dot: "bg-gray-500",              text: "text-gray-400",    bg: "bg-gray-500/10"    },
};
 

 
const statColorMap: Record<string, { iconBg: string; iconText: string; valueColor: string }> = {
  indigo: { iconBg: "bg-indigo-500/15",  iconText: "text-indigo-400",  valueColor: "text-white"     },
  red:    { iconBg: "bg-red-500/15",     iconText: "text-red-400",     valueColor: "text-red-400"   },
  green:  { iconBg: "bg-emerald-500/15", iconText: "text-emerald-400", valueColor: "text-white"     },
  amber:  { iconBg: "bg-amber-500/15",   iconText: "text-amber-400",   valueColor: "text-amber-400" },
};
 
export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardApi.getSummary();
        setData(res.data?.data);
      } catch (err) {
        console.error("Dashboard veri çekme hatası:", err);
      }
      
      try {
        setInsightLoading(true);
        const aiRes = await cargoApi.getAiInsight();
        setInsight(aiRes.data?.data?.insight);
      } catch (err) {
        console.error("AI Insight çekme hatası:", err);
      } finally {
        setInsightLoading(false);
      }
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = data ? [
    { label: "Toplam Sipariş", value: String(data.stats.total_orders), trend: "Canlı Veri", trendType: "neutral", icon: "📦", color: "indigo" },
    { label: "Geciken Kargo",  value: String(data.stats.delayed_cargo), trend: "Kargo Modülü", trendType: data.stats.delayed_cargo > 0 ? "down" : "neutral", icon: "🚚", color: "red" },
    { label: "Memnuniyet",     value: `%${data.stats.satisfaction}`, trend: "Müşteri Modülü", trendType: data.stats.satisfaction > 80 ? "up" : "down", icon: "😊", color: "green" },
    { label: "Kritik Stok",    value: String(data.stats.critical_stock), trend: "Stok Modülü", trendType: data.stats.critical_stock > 0 ? "down" : "neutral", icon: "⚠️", color: "amber" },
  ] : [];

  const orders = data?.latest_orders || [];
  const sentiments = data?.sentiments || [];
  const riskCustomers = data?.risk_customers || [];

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-white" style={{ background: "#0A0A0F" }}>Yükleniyor...</div>;
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}
    >
      <Sidebar />
 
      <main className="flex flex-col flex-1 overflow-hidden">
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ background: "#0A0A0F", borderBottom: "1px solid #1E1E2E" }}
        >
          <div>
            <h1 className="text-lg font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4A4A5E" }}>Günaydın, Duru — 9 Mayıs 2026, Cumartesi</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>🔔</button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold cursor-pointer">DK</div>
          </div>
        </div>
 
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <div className="flex items-start gap-4 px-5 py-4 rounded-xl" style={{ background: "#0F0F1A", border: "1px solid rgba(99,102,241,0.3)" }}>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 mt-0.5" style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
              <span className="text-indigo-400 text-base">✦</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400 mb-1.5">AI Operasyon Özeti</p>
              <div className="text-[13px] leading-relaxed min-h-[40px]" style={{ color: "#C4C4D4" }}>
                {insightLoading ? (
                  <div className="flex flex-col gap-2 animate-pulse mt-1">
                    <div className="h-2.5 bg-indigo-500/20 rounded w-full"></div>
                    <div className="h-2.5 bg-indigo-500/20 rounded w-5/6"></div>
                    <div className="h-2.5 bg-indigo-500/20 rounded w-4/6"></div>
                  </div>
                ) : insight ? (
                  <p>{insight}</p>
                ) : (
                  <p>
                    Bugün <strong className="text-white">{data?.stats?.total_orders || 0} aktif sipariş</strong> var.{" "}
                    <strong className="text-white">{data?.stats?.delayed_cargo || 0} kargo gecikiyor</strong>. 
                    Stokta <strong className="text-white">{data?.stats?.critical_stock || 0} ürün kritik seviyede</strong>.
                    Müşteri memnuniyeti <strong className="text-white">%{data?.stats?.satisfaction || 0}</strong>, verileri inceleyin.
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px]" style={{ color: "#4A4A5E" }}>
                  {insightLoading ? "🤖 AI analiz ediyor..." : "⏱ Canlı Analiz"}
                </span>
              </div>
            </div>
          </div>
 
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => {
              const colors = statColorMap[stat.color];
              return (
                <div key={stat.label} className="rounded-xl p-4 cursor-pointer" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium" style={{ color: "#6B7280" }}>{stat.label}</span>
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${colors.iconBg} ${colors.iconText} text-sm`}>{stat.icon}</div>
                  </div>
                  <p className={`text-[26px] font-bold leading-none mb-1.5 tracking-tight ${colors.valueColor}`}>{stat.value}</p>
                  <p className={`text-xs ${stat.trendType === "up" && stat.color !== "red" ? "text-emerald-400" : stat.trendType === "down" ? "text-red-400" : "text-[#6B7280]"}`}>{stat.trend}</p>
                </div>
              );
            })}
          </div>
 
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 320px" }}>
            <div className="rounded-xl overflow-hidden flex flex-col max-h-[450px]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
              <div className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ borderBottom: "1px solid #1E1E2E" }}>
                <span className="text-sm font-semibold">Son Siparişler</span>
              </div>
              <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#1E1E2E] scrollbar-track-transparent">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10 shadow-sm">
                  <tr style={{ borderBottom: "1px solid #1A1A24", background: "#0F0F16" }}>
                    {["Sipariş", "Müşteri", "Ürün", "Tutar", "Durum"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#4A4A5E" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => {
                    const s = statusConfig[order.status] || statusConfig["processing"];
                    return (
                      <tr key={order.id} className="cursor-pointer transition-colors hover:bg-white/[0.02]" style={{ borderBottom: "1px solid #1A1A24" }}>
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
            </div>
 
            <div className="flex flex-col gap-4">
              <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #1E1E2E" }}>
                  <span className="text-sm font-semibold">Müşteri Duygu Analizi</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3.5">
                  {sentiments.map((s: any) => (
                    <div key={s.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] flex items-center gap-2" style={{ color: "#C4C4D4" }}><span>{s.emoji}</span> {s.label}</span>
                        <span className="text-[13px] font-semibold text-white">{s.count} (%{s.pct})</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "#1A1A24" }}>
                        <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-4" style={{ borderTop: "1px solid #1E1E2E", paddingTop: "14px" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-red-400 mb-2.5">⚠ Risk Altındaki Müşteriler</p>
                  <div className="flex flex-col gap-2">
                    {riskCustomers.map((c: any) => (
                      <div key={c.name} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
                        <div className="flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold text-red-400" style={{ background: "rgba(239,68,68,0.2)" }}>{c.initials}</div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-white">{c.name}</p>
                          <p className="text-[11px]" style={{ color: "#6B7280" }}>Sadakat: {c.score}/100</p>
                        </div>
                        <span className="text-[10px] font-semibold text-red-400 px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.15)" }}>Sinirli</span>
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