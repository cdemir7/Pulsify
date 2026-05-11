# PROGRESS.md — Pulsify Geliştirme Yol Haritası

> Bu dosya, [CLAUDE.md](CLAUDE.md) dosyasının detaylı analizine göre hazırlanmış
> faz bazlı geliştirme planıdır. Her görev tamamlandığında `[ ]` → `[x]` olarak
> işaretle. Sprint sonlarında durum güncellemesi yap.

---

## İçindekiler

- [CLAUDE.md Analiz Özeti](#claudemd-analiz-özeti)
- [Genel İlerleme](#genel-i̇lerleme)
- [Faz 0 — Proje Altyapısı](#faz-0--proje-altyapısı-pre-sprint)
- [Faz 1 — Backend Temeli (Sprint 1)](#faz-1--backend-temeli-sprint-1)
- [Faz 2 — Frontend Temeli (Sprint 1)](#faz-2--frontend-temeli-sprint-1)
- [Faz 3 — Core Features (Sprint 2)](#faz-3--core-features-sprint-2)
- [Faz 4 — AI Özellikleri (Sprint 3)](#faz-4--ai-özellikleri-sprint-3)
- [Faz 5 — Polish & Deploy (Sprint 4)](#faz-5--polish--deploy-sprint-4)
- [Faz 6 — v2.0 Gelecek Özellikler](#faz-6--v20-gelecek-özellikler)
- [Sürekli Görevler](#sürekli-görevler)
- [Risk Takibi](#risk-takibi)

---

## CLAUDE.md Analiz Özeti

### Proje Kimliği
- **Ad:** Pulsify (KOBİ AI Asistanı)
- **Hedef:** KOBİ'lere AI destekli müşteri/sipariş/kargo yönetimi
- **Felsefe:** MVP-first, pragmatic architecture, hızlı iterasyon

### Teknoloji Stack'i
| Katman | Teknoloji | Notlar |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS | Zustand state yönetimi |
| Backend | FastAPI (Python, async-native) | Pydantic, APIRouter |
| Database | MongoDB (Motor — async driver) | **PyMongo değil** |
| AI | Google Gemini 2.5-flash | Türkçe NLP odaklı |
| Deploy | Vercel (FE) + Render (BE) + Atlas (DB) | Free tier başlangıç |

### Kritik Mimari Kararlar
1. **Stateless servisler** — horizontal scaling için
2. **`updated_at`** tüm collection'larda — şema evrimi için
3. **API response standardı** sabit — breaking change önlemi
4. **Backend orchestration** — Gemini API'ye frontend'den çağrı yasak
5. **Async-first** — `asyncio.to_thread()` ile Gemini blocking call'lar wrap edilir

### Modüller (5 ana resource)
- `orders` — Sipariş yönetimi
- `customers` — Müşteri & duygu skorları
- `cargo` — Kargo takibi & uyarılar
- `products` — Ürün & stok
- `ai` — Chatbot, sentiment, raporlar, intent

---

## Genel İlerleme

| Faz | Durum | İlerleme |
|---|---|---|
| Faz 0: Altyapı | ✅ Tamamlandı | 9/9 |
| Faz 1: Backend Temeli | ✅ Tamamlandı | 20/20 |
| Faz 2: Frontend Temeli | 🟡 Kısmi (UI sayfaları var) | 4/14 |
| Faz 3: Core Features | ⬜ Başlamadı | 0/15 |
| Faz 4: AI Özellikleri | ⬜ Başlamadı | 0/12 |
| Faz 5: Polish & Deploy | ⬜ Başlamadı | 0/10 |
| Faz 6: v2.0 | 🔒 MVP sonrası | — |

**Legend:** ⬜ Başlamadı · ⏳ Devam ediyor · 🟡 Kısmi · ✅ Tamamlandı · 🔒 Kilitli

---

## Faz 0 — Proje Altyapısı (Pre-Sprint)

> **Amaç:** Geliştirmeye başlamadan önce repo, dependency ve git altyapısını hazırla.

### Adım 0.1 — Repo & Dokümantasyon
- [x] Git repository başlatıldı
- [x] `.gitignore` Python + Node + IDE için yapılandırıldı
- [x] `CLAUDE.md` proje context dosyası oluşturuldu
- [x] `requirements.txt` ana dizinde oluşturuldu (Backend + Frontend referansları)
- [x] `README.md` oluşturuldu (proje açıklaması, kurulum, kullanım)
- [x] `LICENSE` dosyası eklendi

### Adım 0.2 — Geliştirme Ortamı
- [x] Python sanal ortamı (`.venv`) oluşturuldu
- [x] `requirements.txt` ile bağımlılıklar kuruldu (`pip install -r requirements.txt`)
- [x] `frontend/` klasörü ve `package.json` oluşturuldu
- [x] Node bağımlılıkları kuruldu (`npm install`)

---

## Faz 1 — Backend Temeli (Sprint 1)

> **Amaç:** FastAPI + MongoDB + Gemini bağlantılı, çalışan bir API skeleton.
> **Referans:** CLAUDE.md §4, §5, §7

### Adım 1.1 — Klasör Yapısı
- [x] `backend/` klasörü oluşturuldu
- [x] `backend/app/` modül yapısı kuruldu (`routers/`, `services/`, `models/`, `utils/`)
- [x] `backend/tests/` klasörü hazırlandı
- [x] `backend/.env.example` ve `backend/.env` oluşturuldu

### Adım 1.2 — FastAPI App Factory
- [x] `main.py` — `create_app()` factory pattern (CLAUDE.md §4)
- [x] `app/config.py` — Pydantic `BaseSettings` ile env yönetimi
- [x] CORS middleware kuruldu (CORS_ORIGINS env'den)
- [x] Otomatik Swagger UI testi (`/docs`)

### Adım 1.3 — MongoDB Bağlantısı
- [x] `app/database.py` — Motor async client kurulumu
- [x] MongoDB local kuruldu, Compass ile doğrulandı
- [x] Connection string `.env`'e eklendi
- [x] İndeksler tanımlandı (CLAUDE.md §5 — orders, customers, products, ai_reports)

### Adım 1.4 — Standartlar & Utilities
- [x] `app/utils/response.py` — `success()` ve `error()` helper'ları
- [x] `app/utils/logger.py` — yapılandırılmış logger
- [x] Global exception handler (`@app.exception_handler`)
- [x] Pydantic modelleri için BaseModel template

### Adım 1.5 — Gemini Bağlantı Testi
- [x] `app/services/ai_service.py` — temel sınıf iskeleti
- [x] Gemini API key `.env`'e eklendi
- [x] `genai.configure()` ve test prompt'u çalıştırıldı
- [x] `asyncio.to_thread()` wrapper'ı oluşturuldu (blocking call önlemi)

---

## Faz 2 — Frontend Temeli (Sprint 1)

> **Amaç:** React + Vite + Tailwind + Router kuruldu, sayfalar arası gezinme çalışır.
> **Referans:** CLAUDE.md §3

### Adım 2.1 — Vite + React + TypeScript Kurulumu
- [x] `npm create vite@latest frontend -- --template react-ts`
- [x] TailwindCSS + PostCSS + Autoprefixer kuruldu ve yapılandırıldı
- [x] `tsconfig.json` strict mode aktif
- [x] `.env.example` ve `.env.local` oluşturuldu (`VITE_API_BASE_URL`)

### Adım 2.2 — Klasör Yapısı (CLAUDE.md §3)
- [x] `src/api/`, `src/components/`, `src/hooks/`, `src/pages/`, `src/store/`, `src/types/`, `src/utils/`

### Adım 2.3 — Routing & Layout
- [x] React Router v6 kuruldu
- [x] 5 ana route tanımlandı (Dashboard, Orders, Cargo, Customers, Chatbot)
- [x] Sidebar bileşeni
- [x] Navbar bileşeni
- [x] PageWrapper layout

### Adım 2.4 — Sayfa İskeletleri
- [x] `Dashboard.tsx` — placeholder widget'lar
- [x] `Orders.tsx`, `Cargo.tsx`, `Customers.tsx`, `Chatbot.tsx` placeholder'ları
- [x] `Products.tsx` placeholder

### Adım 2.5 — State & API Katmanı
- [x] Zustand kuruldu, örnek store oluşturuldu
- [x] `src/api/` axios instance ve type-safe wrapper'lar
- [x] Standart error handling pattern (CLAUDE.md §8)
- [x] Backend `api.types.ts` — API response generic tip tanımı

---

## Faz 3 — Core Features (Sprint 2)

> **Amaç:** AI olmadan çalışan tam bir CRUD katmanı.
> **Referans:** CLAUDE.md §5, §6, §11

### Adım 3.1 — Orders Modülü
- [ ] **Backend:** `Order` Pydantic model
- [ ] **Backend:** `routers/orders.py` — GET list, GET detail, POST, PUT, DELETE
- [ ] **Backend:** `services/order_service.py` — Motor query'ler
- [ ] **Frontend:** `useOrders` hook + Zustand store
- [ ] **Frontend:** `Orders.tsx` — liste tablosu, filtreler
- [ ] **Frontend:** Sipariş detay modal/sayfa

### Adım 3.2 — Customers Modülü
- [ ] **Backend:** `Customer` model + CRUD endpoint'leri
- [ ] **Backend:** Sentiment history embedded array yapısı
- [ ] **Frontend:** `Customers.tsx` — liste + sadakat skoru görseli
- [ ] **Frontend:** Müşteri detay sayfası (sentiment trend)

### Adım 3.3 — Cargo Modülü
- [ ] **Backend:** `routers/cargo.py` — sipariş kargo durumu güncellemesi
- [ ] **Frontend:** `Cargo.tsx` — kargo durumu listesi
- [ ] **Frontend:** Geciken kargo vurgulaması (kırmızı badge)

### Adım 3.4 — Dashboard Widget'ları
- [ ] Toplam sipariş kartı
- [ ] Bekleyen kargo kartı
- [ ] Mutsuz müşteri sayısı kartı
- [ ] Stok uyarı kartı

---

## Faz 4 — AI Özellikleri (Sprint 3)

> **Amaç:** Gemini entegrasyonu ile chatbot, duygu analizi ve raporlar aktif.
> **Referans:** CLAUDE.md §7

### Adım 4.1 — AI Service Layer
- [ ] `AIService.analyze_sentiment()` — JSON parse hatalarına dayanıklı
- [ ] `AIService.classify_intent()` — order_query, cargo_query, complaint, other
- [ ] `AIService.generate_daily_report()` — Türkçe rapor üretimi
- [ ] Response cache mekanizması (aynı gün tekrar üretme)
- [ ] Exponential backoff retry (rate limit önlemi)

### Adım 4.2 — AI Endpoint'leri
- [ ] `POST /api/ai/sentiment`
- [ ] `POST /api/ai/chat` — intent classify + DB sorgu + Türkçe yanıt
- [ ] `POST /api/ai/report/daily`
- [ ] `POST /api/ai/loyalty/:id`
- [ ] `POST /api/ai/cargo-alerts`

### Adım 4.3 — Chatbot Frontend
- [ ] `Chatbot.tsx` — mesaj listesi, input, gönderim
- [ ] Loading/typing indikatörü
- [ ] `useAI` hook — API call yönetimi

### Adım 4.4 — Otomatik AI Raporları
- [ ] `ai_reports` collection'a yazma
- [ ] Dashboard'da günün özet raporu kartı

---

## Faz 5 — Polish & Deploy (Sprint 4)

> **Amaç:** Production-ready hale getir ve deploy et.
> **Referans:** CLAUDE.md §9, §10

### Adım 5.1 — UX Düzenlemeleri
- [ ] Responsive tasarım (mobile/tablet/desktop)
- [ ] Loading states tüm async operasyonlarda
- [ ] Error toast/notification sistemi
- [ ] Empty state ekranları

### Adım 5.2 — Test & Kalite
- [ ] `pytest` ile temel endpoint testleri (orders, customers, ai)
- [ ] AI servisi mock testleri (Gemini API çağrısı yapmadan)
- [ ] Manuel E2E test senaryoları yazıldı

### Adım 5.3 — Güvenlik Checklist (CLAUDE.md §9)
- [ ] `DEBUG=False` production'da
- [ ] `SECRET_KEY` random + güçlü
- [ ] CORS whitelist env variable'dan
- [ ] `slowapi` ile rate limiting eklendi
- [ ] `.env` dosyaları gitignore'da
- [ ] MongoDB authentication zorunlu

### Adım 5.4 — Deployment
- [ ] **Backend:** Render hesabı + `Procfile` (`uvicorn main:app --host 0.0.0.0 --port $PORT`)
- [ ] **Backend:** Render env variables yapılandırıldı
- [ ] **Frontend:** Vercel projesi bağlandı
- [ ] **Frontend:** `VITE_API_BASE_URL` production URL'e ayarlandı
- [ ] **DB:** Atlas IP whitelist Render IP'leri için açıldı
- [ ] Production smoke test (5 endpoint manuel)

---

## Faz 6 — v2.0 Gelecek Özellikler

> 🔒 **MVP tamamlandıktan sonra başlanır.** Şimdi mimari kararlarla hazırlık yapılır.
> **Referans:** CLAUDE.md §12

### Hazırlık Görevleri (Şimdi Yapılacak)
- [ ] Tüm collection'larda `updated_at` field standardı
- [ ] API response formatı katı uygulanıyor (breaking change önlemi)
- [ ] Tüm servisler stateless (session/global state yok)
- [ ] API endpoint'leri `/api/v1/` prefix'i için hazır mı? (opsiyonel ama önerilir)

### v2.0 Özellikleri
- [ ] JWT auth + role yönetimi (admin / operasyon / destek)
- [ ] Multi-tenant DB namespace
- [ ] SendGrid e-posta entegrasyonu
- [ ] SMS bildirim entegrasyonu
- [ ] Kargo firma webhook'ları

### v3.0 Özellikleri
- [ ] AI servisi mikro servis ayırması
- [ ] Redis cache katmanı
- [ ] Celery + background AI rapor üretimi
- [ ] Recharts gelişmiş analytics
- [ ] API versioning aktif (`/api/v2/`)

---

## Sürekli Görevler

> Her sprint'te tekrar değerlendirilir, "tamamlandı" sayılmaz.

- [ ] **Code review** — her PR için en az 1 onay
- [ ] **Conventional commits** — `feat()`, `fix()`, `docs()` vb. (CLAUDE.md §13)
- [ ] **CLAUDE.md güncel tut** — mimari karar değişikliklerini yansıt
- [ ] **PROGRESS.md güncel tut** — sprint sonunda durum review'u
- [ ] **Bağımlılık güvenlik taraması** — `pip-audit` / `npm audit` aylık
- [ ] **`.env` sızıntı kontrolü** — secret scanning aktif

---

## Risk Takibi

> CLAUDE.md §15'teki risklere karşı alınan aksiyonlar.

| Risk | Önlem | Durum |
|---|---|---|
| Gemini rate limit | Exponential backoff + cache | ⬜ Henüz uygulanmadı |
| MongoDB free tier dolması | Veri arşivleme rutini | ⬜ Henüz tasarlanmadı |
| CORS prod hataları | Whitelist env'den | ⬜ Henüz uygulanmadı |
| Türkçe NLP kalitesi | Prompt iterasyonu + test seti | ⬜ Henüz başlamadı |
| FE/BE type sync hatası | TypeScript tipleri ortak şema | ⬜ Henüz tasarlanmadı |
| Secret sızıntısı | `.gitignore` + secret scanning | 🟡 `.gitignore` var, scanning yok |
| Render cold start | Ping servisi veya ücretli plan | 🔒 Deploy sonrası |

### FastAPI + Gemini Özel Riskler
- [ ] Gemini `generate_content()` `asyncio.to_thread()` ile wrap edildi
- [ ] Gemini JSON yanıtları her zaman `try/except` parse ediliyor
- [ ] PyMongo değil, Motor kullanıldığı doğrulandı

---

## Değişiklik Geçmişi

| Tarih | Commit | Değişiklik | Not |
|---|---|---|---|
| 2026-05-09 | `94642ac` | `.gitignore` oluşturuldu | Python, Node, IDE dosyaları için temel gitignore |
| 2026-05-09 | `85e912d` | `CLAUDE.md` oluşturuldu | Proje context dosyası — mimari, standartlar, faz planı |
| 2026-05-09 | `78558b2` | `CLAUDE.md` güncellendi | FastAPI stack bilgisi eklendi |
| 2026-05-09 | `15fa091` | Frontend UI sayfaları eklendi | Dashboard, Chatbot, Siparişler, Kargo, Müşteriler placeholder sayfaları |
| 2026-05-09 | `5641988` | `requirements.txt` ve `PROGRESS.md` oluşturuldu | CLAUDE.md analizine göre faz/adım yapısı kuruldu |
| 2026-05-09 | `878c8db` | `README.md` oluşturuldu | Modern, badge'li, ekran görüntüsü placeholder'lı yapı |
| 2026-05-09 | `9e624d5` | MIT Lisansı eklendi | `LICENSE` dosyası oluşturuldu |
| 2026-05-09 | `19a7057` | `PROGRESS.md` güncellendi | İlerleme durumu düzenlendi |
| 2026-05-09 | `3e1dd7f` | React Router eklendi | 5 ana route (Dashboard, Orders, Cargo, Customers, Chatbot) tanımlandı |
| 2026-05-09 | `a41dbe3` | `feature/routing` PR merge edildi | Routing feature branch main'e alındı |
| 2026-05-11 | `bb176da` | Faz 1 (Backend) tamamlandı | FastAPI + MongoDB + Gemini bağlantısı, tüm router/service/model iskeletleri |
| 2026-05-11 | `b88004e` | `.gitignore` ve `PROGRESS.md` güncellendi | Faz 1 tamamlanma durumu yansıtıldı |

---

*Bu dosya canlı bir belgedir. Her sprint sonunda güncelle, gerçeği yansıtmasını sağla.*
