import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"

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
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger — sadece mobilde görünür */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-lg lg:hidden"
        style={{ background: "#111118", border: "1px solid #1E1E2E", color: "#8B8B9E" }}
      >
        ☰
      </button>

      {/* Overlay — mobilde sidebar açıkken */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          flex flex-col w-56 shrink-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: "#0D0D14", borderRight: "1px solid #1E1E2E" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: "1px solid #1E1E2E" }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-base tracking-tight text-white">Pulsify</span>
          </div>
          {/* Kapat butonu — sadece mobilde */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-[#4A4A5E] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 px-2.5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 pt-2 pb-1.5" style={{ color: "#4A4A5E" }}>
            Ana Menü
          </p>

          {navItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleNavigate(item.path)}
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

          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 pt-4 pb-1.5" style={{ color: "#4A4A5E" }}>
            Sistem
          </p>

          {systemItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] text-[#8B8B9E] hover:bg-white/5 hover:text-white transition-all"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        {/* User */}
        <div className="px-2.5 py-3" style={{ borderTop: "1px solid #1E1E2E" }}>
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg relative group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-[11px] font-bold shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">Admin</p>
              <p className="text-[11px]" style={{ color: "#4A4A5E" }}>Yönetici</p>
            </div>
            
            <button 
              onClick={() => {
                useAuthStore.getState().logout();
                window.location.href = "/login";
              }}
              className="text-[#4A4A5E] hover:text-red-400 transition-colors p-1"
              title="Çıkış Yap"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
