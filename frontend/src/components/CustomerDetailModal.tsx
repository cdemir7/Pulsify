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
  total_spent: number;
}
 
interface Props {
  customer: Customer;
  onClose: () => void;
}
 
const getSentimentEmoji = (sentiment: string) => {
  if (sentiment === "happy") return "😊";
  if (sentiment === "angry") return "😠";
  return "😐";
};
 
const getSentimentLabel = (sentiment: string) => {
  if (sentiment === "happy") return "Mutlu";
  if (sentiment === "angry") return "Sinirli";
  return "Nötr";
};
 
const getSentimentColor = (sentiment: string) => {
  if (sentiment === "happy") return "#10B981";
  if (sentiment === "angry") return "#EF4444";
  return "#6B7280";
};
 
const getLoyaltyColor = (score: number) => {
  if (score >= 80) return "#10B981";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
};
 
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
 
export default function CustomerDetailModal({ customer, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: "#111118", border: "1px solid #2A2A38" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1E1E2E" }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold"
              style={{
                background: customer.sentiment === "angry" ? "rgba(239,68,68,0.15)" : customer.sentiment === "happy" ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)",
                color: customer.sentiment === "angry" ? "#EF4444" : customer.sentiment === "happy" ? "#10B981" : "#8B8B9E",
              }}
            >
              {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{customer.name}</p>
              <p className="text-xs" style={{ color: "#6B7280" }}>{customer.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-sm"
            style={{ background: "#1A1A24", border: "1px solid #2A2A38", color: "#6B7280", cursor: "pointer", fontFamily: "inherit" }}
          >
            ✕
          </button>
        </div>
 
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 px-6 py-4" style={{ borderBottom: "1px solid #1E1E2E" }}>
          <div className="rounded-xl p-3 text-center" style={{ background: "#0F0F16" }}>
            <p className="text-[22px] font-bold" style={{ color: getLoyaltyColor(customer.loyalty_score) }}>
              {customer.loyalty_score}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Sadakat Skoru</p>
            <div className="mt-2 h-1 rounded-full" style={{ background: "#1A1A24" }}>
              <div className="h-full rounded-full" style={{ width: `${customer.loyalty_score}%`, background: getLoyaltyColor(customer.loyalty_score) }} />
            </div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "#0F0F16" }}>
            <p className="text-[22px] font-bold text-white">{customer.total_orders}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Toplam Sipariş</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "#0F0F16" }}>
            <p className="text-[22px] font-bold text-white">₺{customer.total_spent.toLocaleString()}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>Toplam Harcama</p>
          </div>
        </div>
 
        {/* Current Sentiment */}
        <div className="px-6 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #1E1E2E" }}>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#4A4A5E" }}>Mevcut Duygu:</span>
          <span className="text-lg">{getSentimentEmoji(customer.sentiment)}</span>
          <span className="text-sm font-semibold" style={{ color: getSentimentColor(customer.sentiment) }}>
            {getSentimentLabel(customer.sentiment)}
          </span>
        </div>
 
        {/* Sentiment History */}
        <div className="px-6 py-4" style={{ maxHeight: "280px", overflowY: "auto" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: "#4A4A5E" }}>
            Duygu Geçmişi
          </p>
          {customer.sentiment_history.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: "#4A4A5E" }}>Henüz duygu geçmişi yok</p>
          ) : (
            <div className="flex flex-col gap-0">
              {customer.sentiment_history.map((item, i) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
                      style={{ background: getSentimentColor(item.sentiment) }}
                    />
                    {i < customer.sentiment_history.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ background: "#1E1E2E", minHeight: "20px" }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getSentimentEmoji(item.sentiment)}</span>
                      <span className="text-[13px] font-semibold" style={{ color: getSentimentColor(item.sentiment) }}>
                        {getSentimentLabel(item.sentiment)}
                      </span>
                    </div>
                    {item.message_ref && (
                      <p className="text-xs mt-0.5" style={{ color: "#8B8B9E" }}>{item.message_ref}</p>
                    )}
                    <p className="text-[11px] mt-0.5" style={{ color: "#4A4A5E" }}>{formatDate(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}