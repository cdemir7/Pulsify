import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api';
import { Box, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', {
        username: email,
        password: password,
      });

      if (response.data?.success) {
        setAuth(response.data.data.access_token, response.data.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0A0A0F' }}>
      
      {/* Arka Plan Işık Efektleri */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(10,10,15,0) 70%)' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(10,10,15,0) 70%)' }}></div>

      <div className="w-full max-w-md p-8 rounded-2xl relative z-10" style={{ background: 'rgba(17, 17, 24, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        {/* Logo ve Başlık */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)' }}>
            <Box size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Pulsify AI'a Hoş Geldiniz</h1>
          <p className="text-sm" style={{ color: '#8B8D98' }}>Operasyonlarınızı zekayla yönetin.</p>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="mb-6 p-3 rounded-lg flex items-start gap-2 border border-red-500/20" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <span className="text-red-400 text-xs mt-0.5 font-bold">⚠</span>
            <p className="text-xs text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#8B8D98' }}>E-Posta Adresi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail size={16} color="#6B7280" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pulsify.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all placeholder-gray-600"
                style={{ background: '#0F0F16', border: '1px solid #1E1E2E' }}
                onFocus={(e) => (e.target.style.border = '1px solid #4F46E5')}
                onBlur={(e) => (e.target.style.border = '1px solid #1E1E2E')}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium" style={{ color: '#8B8D98' }}>Şifre</label>
              <a href="#" className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Şifremi Unuttum</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock size={16} color="#6B7280" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all placeholder-gray-600"
                style={{ background: '#0F0F16', border: '1px solid #1E1E2E' }}
                onFocus={(e) => (e.target.style.border = '1px solid #4F46E5')}
                onBlur={(e) => (e.target.style.border = '1px solid #1E1E2E')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white mt-2 transition-all relative overflow-hidden group"
            style={{ 
              background: loading ? '#3730A3' : '#4F46E5', 
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>Bağlanıyor...</span>
              </span>
            ) : (
              'Giriş Yap'
            )}
            {/* Hover Etkisi */}
            {!loading && (
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[11px] mt-8" style={{ color: '#4A4A5E' }}>
          &copy; 2026 Pulsify Logistics AI. Tüm hakları saklıdır.
        </p>

      </div>
    </div>
  );
}
