import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { label: "Dashboard",  icon: "▦",  path: "/dashboard", badge: null  },
  { label: "AI Asistan", icon: "🤖", path: "/chatbot",   badge: "3"   },
  { label: "Siparişler", icon: "📦", path: "/orders",    badge: null  },
  { label: "Kargo",      icon: "🚚", path: "/cargo",     badge: "!"   },
  { label: "Müşteriler", icon: "👥", path: "/customers", badge: null  },
]

const systemItems = [
  { label: "Raporlar", icon: "📊", path: "/reports" },
  { label: "Ayarlar",  icon: "⚙️", path: "/settings" },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <aside
      className="flex flex-col w-56 shrink-0"
      style={{ background: "#0D0D14", borderRight: "1px solid #1E1E2E" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid #1E1E2E" }}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <span className="font-bold text-base tracking-tight text-white">Pulsify</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 px-2.5 py-3">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest px-2 pt-2 pb-1.5"
          style={{ color: "#4A4A5E" }}
        >
          Ana Menü
        </p>

        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] transition-all ${
              isActive(item.path)
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

        <p
          className="text-[10px] font-semibold uppercase tracking-widest px-2 pt-4 pb-1.5"
          style={{ color: "#4A4A5E" }}
        >
          Sistem
        </p>

        {systemItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] text-[#8B8B9E] hover:bg-white/5 hover:text-white transition-all"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
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
          <span style={{ color: "#4A4A5E" }}>···</span>
        </div>
      </div>
    </aside>
  )
}