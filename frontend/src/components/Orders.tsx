import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useOrderStore } from "../store/useOrderStore";
import type { Order, OrderStatus } from "../types/api.types";

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  delivered:  { label: "Teslim",    dot: "bg-emerald-500",           text: "text-emerald-400", bg: "bg-emerald-500/10" },
  delayed:    { label: "Gecikiyor", dot: "bg-red-500 animate-pulse", text: "text-red-400",     bg: "bg-red-500/10"     },
  processing: { label: "İşlemde",   dot: "bg-indigo-500",            text: "text-indigo-400",  bg: "bg-indigo-500/10"  },
  cancelled:  { label: "İptal",     dot: "bg-gray-500",              text: "text-gray-400",    bg: "bg-gray-500/10"    },
  pending:    { label: "Bekliyor",  dot: "bg-amber-500",             text: "text-amber-400",   bg: "bg-amber-500/10"   },
  shipped:    { label: "Kargoda",   dot: "bg-blue-500",              text: "text-blue-400",    bg: "bg-blue-500/10"    },
};

const cargoConfig: Record<string, { label: string; text: string }> = {
  not_shipped: { label: "Kargoya Verilmedi", text: "text-[#6B7280]" },
  in_transit:  { label: "Yolda",             text: "text-blue-400"  },
  delayed:     { label: "Gecikiyor",          text: "text-red-400"   },
  delivered:   { label: "Teslim Edildi",      text: "text-emerald-400" },
};

const allStatuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled", "delayed"];

const tabs = [
  { key: "all",        label: "Tümü"      },
  { key: "pending",    label: "Bekliyor"  },
  { key: "processing", label: "İşlemde"   },
  { key: "delayed",    label: "Gecikiyor" },
  { key: "delivered",  label: "Teslim"    },
  { key: "cancelled",  label: "İptal"     },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#4A4A5E" }}>{label}</span>
      <span className="text-[13px] text-white">{value}</span>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onStatusChange }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const s = statusConfig[order.status] ?? statusConfig["pending"];
  const c = cargoConfig[order.cargo_status] ?? cargoConfig["not_shipped"];
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = (newStatus: OrderStatus) => {
    setUpdating(true);
    onStatusChange(order.id, newStatus);
    setUpdating(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden"
        style={{ background: "#111118", border: "1px solid #1E1E2E", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1E1E2E" }}>
          <div>
            <p className="font-mono text-xs mb-1" style={{ color: "#4A4A5E" }}>{order.order_code}</p>
            <h2 className="text-base font-bold text-white">{order.customer_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[#6B7280] hover:text-white transition-colors"
            style={{ background: "#1A1A24", border: "1px solid #2A2A38" }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Durum Badge */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold ${s.bg} ${s.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <span className={`text-[12px] font-medium ${c.text}`}>{c.label}</span>
          </div>

          {/* Sipariş Detayları */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl" style={{ background: "#0D0D14", border: "1px solid #1A1A24" }}>
            <DetailRow label="Sipariş Kodu" value={<span className="font-mono">{order.order_code}</span>} />
            <DetailRow label="Müşteri Adı" value={order.customer_name} />
            <DetailRow label="Ürün" value={order.product} />
            <DetailRow label="Tutar" value={`₺${order.amount.toLocaleString("tr-TR")}`} />
            <DetailRow label="Takip No" value={order.tracking_number ?? "—"} />
            <DetailRow label="Kargo Firması" value={order.cargo_company ?? "—"} />
            <DetailRow
              label="Oluşturulma"
              value={new Date(order.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}
            />
            <DetailRow
              label="Tahmini Teslimat"
              value={order.estimated_delivery
                ? new Date(order.estimated_delivery).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
                : "—"}
            />
          </div>

          {/* Durum Güncelle */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#4A4A5E" }}>Durumu Güncelle</p>
            <div className="flex flex-wrap gap-2">
              {allStatuses.map((status) => {
                const cfg = statusConfig[status];
                const isActive = order.status === status;
                return (
                  <button
                    key={status}
                    disabled={isActive || updating}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                      isActive
                        ? `${cfg.bg} ${cfg.text} cursor-default`
                        : "text-[#6B7280] hover:text-white cursor-pointer"
                    }`}
                    style={{ border: `1px solid ${isActive ? "transparent" : "#2A2A38"}`, background: isActive ? undefined : "#1A1A24" }}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end" style={{ borderTop: "1px solid #1E1E2E" }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
            style={{ background: "#1A1A24", border: "1px solid #2A2A38" }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { orders, total, isLoading, error, fetchOrders, updateOrder } = useOrderStore();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders(activeTab === "all" ? undefined : activeTab);
  }, [activeTab]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    await updateOrder(id, { status });
    setSelectedOrder((prev) => prev ? { ...prev, status } : null);
  };

  const filtered = orders.filter((o: Order) =>
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.order_code.toLowerCase().includes(search.toLowerCase()) ||
    o.product.toLowerCase().includes(search.toLowerCase())
  );

  const tabCounts = tabs.map((t) => ({
    ...t,
    count: t.key === "all" ? total : orders.filter((o) => o.status === t.key).length,
  }));

  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0F", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F1F1F5" }}>
      <Sidebar />

      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ background: "#0A0A0F", borderBottom: "1px solid #1E1E2E" }}>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Siparişler</h1>
            <p className="text-xs mt-0.5" style={{ color: "#4A4A5E" }}>Toplam {total} sipariş</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280]" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>🔔</button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">CD</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {/* Tabs + Search */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex gap-0.5 p-1 rounded-xl" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
              {tabCounts.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] transition-all cursor-pointer ${activeTab === tab.key ? "font-semibold text-white" : "text-[#6B7280] hover:text-white"}`}
                  style={{ background: activeTab === tab.key ? "#1A1A24" : "none", border: "none" }}
                >
                  {tab.label}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded ${activeTab === tab.key ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-[#6B7280]"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-3 h-9 rounded-lg" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
              <span className="text-[#4A4A5E] text-sm">🔍</span>
              <input
                type="text"
                placeholder="Sipariş, müşteri ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-[13px] text-white w-44"
              />
            </div>
          </div>

          {isLoading && <div className="text-center py-12 text-[#4A4A5E] text-sm">Yükleniyor...</div>}
          {error && <div className="text-center py-12 text-red-400 text-sm">{error}</div>}

          {!isLoading && !error && (
            <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: "#111118", border: "1px solid #1E1E2E" }}>
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-[#4A4A5E] text-sm">Sipariş bulunamadı</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: "#0F0F16", borderBottom: "1px solid #1A1A24" }}>
                      {["Sipariş No", "Müşteri", "Ürün", "Tutar", "Durum", "Kargo", "Tarih", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#4A4A5E" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order: Order) => {
                      const s = statusConfig[order.status] ?? statusConfig["pending"];
                      return (
                        <tr
                          key={order.id}
                          className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                          style={{ borderBottom: "1px solid #1A1A24" }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-4 py-3 font-mono text-xs" style={{ color: "#6B7280" }}>{order.order_code}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold shrink-0 bg-indigo-500/20 text-indigo-400">
                                {initials(order.customer_name)}
                              </div>
                              <p className="text-[13px] font-medium text-white">{order.customer_name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[13px]" style={{ color: "#C4C4D4" }}>{order.product}</td>
                          <td className="px-4 py-3 text-[13px] font-semibold text-white">₺{order.amount.toLocaleString("tr-TR")}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold ${s.bg} ${s.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                              {s.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px]" style={{ color: order.tracking_number ? "#6B7280" : "#4A4A5E" }}>
                            {order.tracking_number ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-[13px]" style={{ color: "#6B7280" }}>
                            {new Date(order.created_at).toLocaleDateString("tr-TR")}
                          </td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center justify-center w-7 h-7 rounded-lg text-[13px] transition-all hover:text-indigo-400"
                              style={{ border: "1px solid #2A2A38", background: "none", color: "#6B7280", cursor: "pointer" }}
                            >
                              👁
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid #1A1A24", background: "#0F0F16" }}>
                <span className="text-xs" style={{ color: "#4A4A5E" }}>{filtered.length} / {total} sipariş gösteriliyor</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
