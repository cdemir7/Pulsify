import { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let externalAddToast: ((message: string, type: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = "success") {
  externalAddToast?.(message, type);
}

const icons: Record<ToastType, string> = {
  success: "✓",
  error:   "✕",
  warning: "⚠",
};

const styles: Record<ToastType, { border: string; icon: string; bg: string }> = {
  success: { border: "#10B981", icon: "text-emerald-400", bg: "bg-emerald-500/10" },
  error:   { border: "#EF4444", icon: "text-red-400",     bg: "bg-red-500/10"     },
  warning: { border: "#F59E0B", icon: "text-amber-400",   bg: "bg-amber-500/10"   },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    externalAddToast = addToast;
    return () => { externalAddToast = null; };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((t) => {
        const s = styles[t.type];
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl"
            style={{ background: "#111118", border: `1px solid ${s.border}40` }}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${s.bg} ${s.icon}`}>
              {icons[t.type]}
            </div>
            <p className="text-[13px] text-white flex-1">{t.message}</p>
          </div>
        );
      })}
    </div>
  );
}
