import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { cargoApi } from "../api";

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

export default function DelayedCargoList() {
  const navigate = useNavigate();
  const [delayedCargos, setDelayedCargos] = useState<CargoOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifiedList, setNotifiedList] = useState<string[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDelayed = async () => {
      try {
        setLoading(true);
        const res = await cargoApi.getDelayed();
        setDelayedCargos(res.data?.data ?? []);
      } catch (err) {
        setError("Geciken kargolar yüklenemedi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDelayed();
  }, []);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const getDelayLevel = (days: number) => (days >= 2 ? "high" : "mid");

  const handleNotify = async (id: string) => {
    try {
      await cargoApi.notify(id);
      setNotifiedList((prev) => [...prev, id]);
    } catch (err) {
      console.error("Bildirim gönderilemedi:", err);
      alert("Bildirim gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(delayedCargos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = delayedCargos.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}>
      <Sidebar />

      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ background: "#0A0A0F", borderBottom: "1px solid #1E1E2E" }}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/cargo')}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/5 cursor-pointer" 
              style={{ color: "#8B8B9E", border: "1px solid #1E1E2E" }}
            >
              ←
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Tüm Geciken Kargolar</h1>
              <p className="text-xs mt-0.5" style={{ color: "#8B8B9E" }}>Gecikme süresine göre sıralanmış acil müdahale listesi</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: "#111118", border: "1px solid #1E1E2E", minHeight: "600px" }}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#0F0F16", borderBottom: "1px solid #1A1A24" }}>
                  {["Takip No", "Müşteri", "Sipariş Kodu", "Beklenen Tarih", "Gecikme Süresi", "Kargo Firması", "İşlem"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "#4A4A5E" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: "#6B7280" }}>Yükleniyor...</td></tr>
                ) : error ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-red-400">{error}</td></tr>
                ) : delayedCargos.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: "#6B7280" }}>Şu anda geciken kargo bulunmuyor 🎉</td></tr>
                ) : currentItems.map((cargo) => {
                  const delayDays = cargo.delay_days ?? 0;
                  const delayLevel = getDelayLevel(delayDays);
                  const initials = getInitials(cargo.customer_name);
                  const expectedDate = cargo.estimated_delivery
                    ? new Date(cargo.estimated_delivery).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })
                    : "—";

                  return (
                    <tr key={cargo.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid #1A1A24" }}>
                      <td className="px-6 py-4 font-mono text-sm" style={{ color: "#8B8B9E" }}>{cargo.tracking_number ?? "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>
                            {initials}
                          </div>
                          <span className="text-sm text-white font-medium">{cargo.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs" style={{ color: "#6B7280" }}>{cargo.order_code}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: "#8B8B9E" }}>{expectedDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold ${delayLevel === "high" ? "text-red-400 bg-red-500/12" : "text-amber-400 bg-amber-500/12"}`}>
                          ⏱ {delayDays} gün geç
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: "#C4C4D4" }}>
                        {cargo.cargo_company ?? "Bilinmiyor"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          {(() => {
                            const isNotifiedThisSession = notifiedList.includes(cargo.id);
                            return (
                              <button
                                onClick={() => !isNotifiedThisSession && handleNotify(cargo.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                                style={{
                                  border: isNotifiedThisSession ? "1px solid rgba(16,185,129,0.3)" : "1px solid #2A2A38",
                                  background: isNotifiedThisSession ? "rgba(16,185,129,0.06)" : "none",
                                  color: isNotifiedThisSession ? "#10B981" : "#8B8B9E",
                                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                              >
                                {isNotifiedThisSession ? "✓ Gönderildi" : "➤ Bildir"}
                              </button>
                            );
                          })()}
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

            {/* Pagination Controls */}
            {!loading && delayedCargos.length > 0 && (
              <div className="mt-auto flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid #1A1A24", background: "#0F0F16" }}>
                <span className="text-xs font-medium" style={{ color: "#6B7280" }}>
                  Toplam {delayedCargos.length} kayıttan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, delayedCargos.length)} arası gösteriliyor
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-white/5" 
                    style={{ border: "1px solid #2A2A38", color: "#8B8B9E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Önceki
                  </button>
                  <div className="flex items-center justify-center min-w-[32px] px-2 py-1.5 rounded-lg text-xs font-bold bg-indigo-500 text-white">
                    {currentPage} / {totalPages || 1}
                  </div>
                  <button 
                    onClick={handleNextPage} 
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-white/5" 
                    style={{ border: "1px solid #2A2A38", color: "#8B8B9E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
