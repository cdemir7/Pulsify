import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar'
import { cargoApi } from '../api';

const TRIAGE_CACHE_KEY = "pulsify_cargo_triage";

function loadTriageCache(): { list: any[]; timestamp: string } | null {
  try {
    const raw = localStorage.getItem(TRIAGE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function formatTs(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "Az önce";
  if (diff < 60) return `${diff} dk önce`;
  return `${Math.floor(diff / 60)} saat önce`;
}

interface CargoOrder {
  id: string;
  order_code: string;
  customer_name: string;
  tracking_number?: string;
  estimated_delivery?: string;
  cargo_status: string;
  cargo_company?: string;
  delay_days?: number;
  last_notified_at?: string;
}

interface CargoStats {
  delayed: number;
  delivered: number;
  in_transit: number;
  total_shipped: number;
  on_time_percentage: number;
}

export default function Cargo() {
  const navigate = useNavigate();
  const [delayedCargos, setDelayedCargos] = useState<CargoOrder[]>([]);
  const [stats, setStats] = useState<CargoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifiedList, setNotifiedList] = useState<string[]>([]);
  const [aiDismissed, setAiDismissed] = useState(false);
  const [allNotified, setAllNotified] = useState(false);
  const [triageCache, setTriageCache] = useState<{ list: any[]; timestamp: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [ceoInsight, setCeoInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    // Cache'i yükle
    setTriageCache(loadTriageCache());

    const fetchData = async () => {
      try {
        setLoading(true);
        const [delayedRes, statsRes] = await Promise.all([
          cargoApi.getDelayed(),
          cargoApi.getStats(),
        ]);
        setDelayedCargos(delayedRes.data?.data ?? []);
        setStats(statsRes.data?.data ?? null);
      } catch (err) {
        setError("Kargo verileri yüklenemedi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNotify = async (id: string) => {
    try {
      await cargoApi.notify(id);
      setNotifiedList((prev) => [...prev, id]);
    } catch (err) {
      console.error("Bildirim gönderilemedi:", err);
      alert("Bildirim gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleNotifyAll = async () => {
    try {
      const promises = delayedCargos.map((c) => cargoApi.notify(c.id));
      await Promise.all(promises);
      setNotifiedList(delayedCargos.map((c) => c.id));
      setAllNotified(true);
      setAiDismissed(true);
    } catch (err) {
      console.error("Toplu bildirim başarısız:", err);
      alert("Bazı bildirimler gönderilemedi.");
    }
  };

  const handleRunAiTriage = async () => {
    try {
      setAiLoading(true);
      const res = await cargoApi.getAiTriage();
      const list = res.data?.data ?? [];
      const entry = { list, timestamp: new Date().toISOString() };
      localStorage.setItem(TRIAGE_CACHE_KEY, JSON.stringify(entry));
      setTriageCache(entry);
    } catch (err) {
      console.error("AI Triage başarısız:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGetCeoInsight = async () => {
    try {
      setInsightLoading(true);
      const res = await cargoApi.getAiInsight();
      setCeoInsight(res.data?.data?.insight ?? "Özet oluşturulamadı.");
    } catch (err) {
      console.error("CEO Özeti başarısız:", err);
      alert("AI CEO özeti üretilemedi.");
    } finally {
      setInsightLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const getDelayLevel = (days: number) => (days >= 2 ? "high" : "mid");


  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}>
      <Sidebar />

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
          {!loading && (stats?.delayed ?? 0) > 0 && (
            <div className="flex items-center gap-4 px-5 py-4 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 text-red-400 text-lg animate-pulse" style={{ background: "rgba(239,68,68,0.15)" }}>⚠️</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-400">{stats?.delayed} kargo gecikiyor — acil aksiyon gerekli</p>
                <p className="text-xs mt-0.5" style={{ color: "#8B8B9E" }}>Geciken kargoları inceleyin ve müşterileri bilgilendirin</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={handleNotifyAll} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer" style={{ background: allNotified ? "#10B981" : "#EF4444", border: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {allNotified ? "✓ Gönderildi" : "➤ Hepsine Bildir"}
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Geciken Kargo",    value: loading ? "—" : String(stats?.delayed ?? 0),         sub: "geciken teslimat",       icon: "⏰", valueColor: "#EF4444" },
              { label: "Yolda",            value: loading ? "—" : String(stats?.in_transit ?? 0),       sub: "aktif kargo",           icon: "🚚", valueColor: "#6366F1" },
              { label: "Zamanında Teslim", value: loading ? "—" : `%${stats?.on_time_percentage ?? 0}`, sub: "teslim oranı",           icon: "✅", valueColor: "#10B981" },
              { label: "Toplam Teslim",    value: loading ? "—" : String(stats?.delivered ?? 0),        sub: "başarıyla teslim edildi", icon: "📦", valueColor: "#F1F1F5" },
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
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold text-red-400" style={{ background: "rgba(239,68,68,0.12)" }}>{delayedCargos.length} kargo</span>
                  </div>
                  <span 
                    onClick={() => navigate('/cargo/delayed')}
                    className="text-xs text-indigo-400 font-medium cursor-pointer hover:underline transition-all"
                  >
                    Tümünü Gör →
                  </span>
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
                    {loading ? (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: "#6B7280" }}>Yükleniyor...</td></tr>
                    ) : error ? (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-red-400">{error}</td></tr>
                    ) : delayedCargos.length === 0 ? (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: "#6B7280" }}>Geciken kargo yok 🎉</td></tr>
                    ) : delayedCargos.map((cargo) => {
                      const isNotified = notifiedList.includes(cargo.id);
                      const delayDays = cargo.delay_days ?? 0;
                      const delayLevel = getDelayLevel(delayDays);
                      const initials = getInitials(cargo.customer_name);
                      const expectedDate = cargo.estimated_delivery
                        ? new Date(cargo.estimated_delivery).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })
                        : "—";
                      return (
                        <tr key={cargo.id} className="cursor-pointer hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid #1A1A24" }}>
                          <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#6B7280" }}>{cargo.tracking_number ?? "—"}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>{initials}</div>
                              <span className="text-[13px] text-white font-medium">{cargo.customer_name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-[13px]" style={{ color: "#6B7280" }}>{expectedDate}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold ${delayLevel === "high" ? "text-red-400 bg-red-500/12" : "text-amber-400 bg-amber-500/12"}`}>
                              ⏱ {delayDays} gün
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-base">😠</td>
                          <td className="px-5 py-3.5">
                            <div className="flex flex-col gap-1.5 items-start">
                              <button
                                onClick={() => !isNotified && handleNotify(cargo.id)}
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
                              {cargo.last_notified_at && (
                                <span className="text-[10px]" style={{ color: "#6B7280" }}>
                                  Son: {new Date(cargo.last_notified_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* AI Triage Card */}
              {!aiDismissed && (
                <div className="rounded-xl overflow-hidden" style={{ background: "#0F0F1A", border: "1px solid rgba(99,102,241,0.25)" }}>
                  <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
                    <span className="text-indigo-400 text-base">🤖</span>
                    <span className="text-[13px] font-semibold text-indigo-400 flex-1">AI Kargo Triyaj Optimizasyonu</span>
                    <button
                      onClick={handleRunAiTriage}
                      disabled={aiLoading}
                      className="text-[11px] bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-md cursor-pointer hover:bg-indigo-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {aiLoading ? "Hesaplanıyor..." : triageCache ? "↺ Yenile" : "Şimdi Çalıştır"}
                    </button>
                  </div>
                  <div className="px-5 py-4">
                    {aiLoading ? (
                      <div className="flex flex-col gap-2 animate-pulse">
                        {[1,2,3].map(i => (
                          <div key={i} className="h-16 rounded-lg" style={{ background: "rgba(99,102,241,0.08)" }} />
                        ))}
                      </div>
                    ) : triageCache ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[12px] text-indigo-300">
                            ✓ Haversine formülü ile mesafeler hesaplandı ve öncelikler belirlendi.
                          </p>
                          <span className="text-[10px] shrink-0 ml-3" style={{ color: "#4A4A5E" }}>
                            {formatTs(triageCache.timestamp)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-3 pr-2 overflow-y-auto" style={{ maxHeight: "300px" }}>
                          {triageCache.list.map((item, index) => (
                            <div key={item.id} className="flex flex-col gap-1.5 p-3 rounded-lg shrink-0" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)" }}>
                              <div className="flex justify-between items-center">
                                <span className="text-[13px] font-bold text-white">{index + 1}. {item.customer_name}</span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Skor: {item.ai_score}</span>
                              </div>
                              <span className="text-[12px]" style={{ color: "#8B8B9E" }}>
                                <strong>Neden:</strong> {item.ai_reason}
                              </span>
                              <div className="flex gap-4 mt-1 text-[11px] font-medium" style={{ color: "#6B7280" }}>
                                <span>📍 {item.delivery_city} ({item.distance_km}km)</span>
                                <span>⏱ {item.delay_days} gün gecikme</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[13px] leading-relaxed" style={{ color: "#C4C4D4" }}>
                        Kuş uçuşu mesafe, müşteri duygu durumu ve gecikme süresine göre kargo sırasını optimize etmek için <strong className="text-white">AI Triyaj</strong> sistemini çalıştırın.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="flex flex-col gap-4">
              {/* CEO Insight Widget */}
              <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(to bottom right, #111118, #0B0B12)", border: "1px solid rgba(168,85,247,0.25)" }}>
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(168,85,247,0.15)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 text-sm">✨</span>
                    <span className="text-sm font-semibold text-purple-100">CEO Operasyon Özeti</span>
                  </div>
                  {!ceoInsight && (
                    <button onClick={handleGetCeoInsight} disabled={insightLoading} className="text-[11px] bg-purple-500/20 text-purple-300 px-3 py-1 rounded-md cursor-pointer hover:bg-purple-500/30 transition-colors">
                      {insightLoading ? "Analiz Ediliyor..." : "Rapor Üret"}
                    </button>
                  )}
                </div>
                <div className="px-5 py-4">
                  {insightLoading ? (
                    <div className="flex flex-col gap-2 animate-pulse">
                      <div className="h-2.5 bg-purple-500/20 rounded w-full"></div>
                      <div className="h-2.5 bg-purple-500/20 rounded w-5/6"></div>
                      <div className="h-2.5 bg-purple-500/20 rounded w-4/6"></div>
                    </div>
                  ) : ceoInsight ? (
                    <p className="text-[13px] leading-relaxed text-purple-50">
                      {ceoInsight}
                    </p>
                  ) : (
                    <p className="text-[12px] text-[#8B8B9E] italic text-center py-2">
                      Günlük kargo istatistiklerini Gemini AI ile analiz edin.
                    </p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #1E1E2E" }}>
                  <span className="text-sm font-semibold">Kargo Zaman Çizelgesi</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-0">
                  {delayedCargos.length === 0 ? (
                    <p className="text-xs text-[#6B7280]">Aktif olay yok</p>
                  ) : (
                    delayedCargos.slice(0, 5).map((item, i) => (
                      <div key={item.id} className="flex gap-3 pb-4 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${item.cargo_status === 'delayed' ? 'bg-red-500' : 'bg-amber-500'}`} />
                          {i < Math.min(delayedCargos.length, 5) - 1 && <div className="w-px flex-1 mt-1" style={{ background: "#1E1E2E", minHeight: "20px" }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-white">{item.tracking_number} gecikiyor</p>
                          <p className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>{item.customer_name} · {item.delay_days} gün geç</p>
                          <p className="text-[11px] mt-0.5" style={{ color: "#4A4A5E" }}>Sistem Uyarısı</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Daily Report */}
              <div className="rounded-xl overflow-hidden" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #1E1E2E" }}>
                  <span className="text-sm font-semibold">Günlük Rapor</span>
                  <span className="text-[11px]" style={{ color: "#4A4A5E" }}>{new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-2">
                  {[
                    { icon: "📦", label: "Toplam Gönderim", value: stats?.total_shipped ?? "—", color: "#F1F1F5" },
                    { icon: "✅", label: "Teslim Edildi",    value: stats?.delivered ?? "—",     color: "#10B981" },
                    { icon: "⏰", label: "Gecikiyor",        value: stats?.delayed ?? "—",       color: "#EF4444" },
                    { icon: "🚚", label: "Yolda",           value: stats?.in_transit ?? "—",    color: "#6366F1" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "#0F0F16" }}>
                      <span className="text-xs flex items-center gap-2" style={{ color: "#8B8B9E" }}>
                        <span>{row.icon}</span> {row.label}
                      </span>
                      <span className="text-[13px] font-semibold" style={{ color: row.color }}>{String(row.value)}</span>
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