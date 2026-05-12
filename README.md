<div align="center">

<!-- LOGO / BANNER -->
<!-- TODO: Buraya proje logosu veya banner görseli eklenecek -->
<!-- <img src="docs/assets/banner.png" alt="Pulsify Banner" width="100%" /> -->

# Pulsify

**KOBİ'ler için AI Destekli Operasyon Yönetim Platformu**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/gemini)

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-MVP_Geliştirme-orange?style=for-the-badge)](#)

</div>

---

## Nedir?

**Pulsify**, küçük ve orta ölçekli işletmelerin (KOBİ) müşteri iletişimini, sipariş yönetimini, kargo takibini ve operasyon süreçlerini tek ekrandan, yapay zeka destekli olarak yönetmesini sağlayan modern bir platformdur.

Türkçe doğal dil işleme (NLP) ile güçlendirilmiş AI asistanı sayesinde; sipariş durumu sorgulama, kargo gecikmelerini tespit etme, müşteri memnuniyetini analiz etme ve günlük operasyon raporu üretme işlemleri otomatik olarak gerçekleşir.

---

## Özellikler

| Modül | Özellik | Açıklama |
|---|---|---|
| **Sipariş Yönetimi** | CRUD + Durum Takibi | Tüm siparişleri listele, filtrele, güncelle |
| **Kargo Takibi** | Anlık Durum + Gecikme Uyarısı | Geciken kargoları otomatik tespit et |
| **Müşteri Paneli** | Sadakat Skoru + Duygu Analizi | Mutlu/mutsuz müşterileri AI ile sınıflandır |
| **AI Chatbot** | Türkçe NLP | Müşteri mesajlarını anlayan akıllı asistan |
| **Günlük Rapor** | AI Özet | Gemini ile otomatik operasyon raporu |
| **Stok Takibi** | Kritik Stok Uyarısı | Eşik altına düşen ürünleri anlık gör |

---

## Ekran Görüntüleri

<!-- TODO: Aşağıdaki görsel alanları, uygulama hazır olduğunda doldurulacak -->

### Dashboard
<!-- <img src="docs/assets/screenshot-dashboard.png" alt="Dashboard" width="100%" /> -->
```
[ Dashboard ekran görüntüsü eklenecek ]
```

### Sipariş Yönetimi
<!-- <img src="docs/assets/screenshot-orders.png" alt="Sipariş Yönetimi" width="100%" /> -->
```
[ Sipariş listesi ekran görüntüsü eklenecek ]
```

### AI Chatbot
<!-- <img src="docs/assets/screenshot-chatbot.png" alt="AI Chatbot" width="100%" /> -->
```
[ Chatbot ekran görüntüsü eklenecek ]
```

### Kargo Takibi
<!-- <img src="docs/assets/screenshot-cargo.png" alt="Kargo Takibi" width="100%" /> -->
```
[ Kargo takip ekran görüntüsü eklenecek ]
```

---

## Mimari

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                    │
│          React 18 + TypeScript + TailwindCSS            │
│        Zustand State · React Router v6 · Axios          │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS / REST
┌───────────────────────▼─────────────────────────────────┐
│                   BACKEND (Render)                      │
│                FastAPI (Python, Async)                  │
│         Pydantic Validation · APIRouter · Motor         │
└──────┬──────────────────────────┬───────────────────────┘
       │                          │
┌──────▼──────┐          ┌────────▼────────┐
│  MongoDB    │          │  Gemini API     │
│   Atlas     │          │  2.5-flash      │
│  (NoSQL)    │          │  Türkçe NLP     │
└─────────────┘          └─────────────────┘
```

---

## Teknoloji Stack'i

### Backend
- **[FastAPI](https://fastapi.tiangolo.com)** — Async-native, otomatik Swagger UI, Pydantic entegrasyonu
- **[Motor](https://motor.readthedocs.io)** — Async MongoDB driver (PyMongo değil)
- **[Pydantic v2](https://docs.pydantic.dev)** — Tip güvenli veri doğrulama
- **[Google Generative AI](https://ai.google.dev)** — Gemini 2.5-flash, Türkçe NLP
- **[SlowAPI](https://slowapi.readthedocs.io)** — Rate limiting
- **[Uvicorn](https://www.uvicorn.org)** — ASGI server

### Frontend
- **[React 18](https://react.dev)** — Component tabanlı UI
- **[TypeScript 5.6](https://typescriptlang.org)** — Tip güvenliği
- **[Vite](https://vitejs.dev)** — Hızlı build tool
- **[TailwindCSS](https://tailwindcss.com)** — Utility-first CSS
- **[Zustand](https://zustand-demo.pmnd.rs)** — Minimal state yönetimi
- **[React Router v6](https://reactrouter.com)** — Client-side routing
- **[Axios](https://axios-http.com)** — HTTP client

### Altyapı
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** — Yönetilen cloud veritabanı
- **[Render](https://render.com)** — Backend hosting
- **[Vercel](https://vercel.com)** — Frontend hosting & CDN

---

## Kurulum

### Gereksinimler

- Python 3.11+
- Node.js 18+
- MongoDB Atlas hesabı
- Google Gemini API key ([ai.google.dev](https://ai.google.dev))

### 1. Repoyu Klonla

```bash
git clone https://github.com/kullanici-adi/pulsify.git
cd pulsify
```

### 2. Backend Kurulumu

```bash
# Sanal ortam oluştur ve aktif et
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Bağımlılıkları kur
pip install -r requirements.txt
```

```bash
# Backend ortam değişkenlerini ayarla
cd backend
cp .env.example .env
# .env dosyasını düzenle (MONGO_URI, GEMINI_API_KEY vb.)
```

```bash
# Backend'i başlat
uvicorn main:app --reload
# API Dokümantasyonu: http://localhost:8000/docs
```

### 3. Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları kur
npm install

# Ortam değişkenlerini ayarla
cp .env.example .env.local
# VITE_API_BASE_URL=http://localhost:8000

# Geliştirme sunucusunu başlat
npm run dev
# Uygulama: http://localhost:5173
```

---

## Ortam Değişkenleri

### Backend (`backend/.env`)

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/pulsify
GEMINI_API_KEY=your-gemini-api-key
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:5173
DEBUG=True
```

### Frontend (`frontend/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## API Dokümantasyonu

Backend çalıştırıldıktan sonra Swagger UI otomatik olarak şu adreste açılır:

```
http://localhost:8000/docs
```

### Ana Endpoint Grupları

| Grup | Prefix | Açıklama |
|---|---|---|
| Siparişler | `/api/orders` | Sipariş CRUD işlemleri |
| Müşteriler | `/api/customers` | Müşteri & sadakat yönetimi |
| Kargo | `/api/cargo` | Kargo takibi & uyarılar |
| AI | `/api/ai` | Chatbot, duygu analizi, raporlar |

---

## Proje Yapısı

```
pulsify/
├── backend/
│   ├── app/
│   │   ├── routers/        # API endpoint grupları
│   │   ├── services/       # İş mantığı katmanı
│   │   ├── models/         # Pydantic veri modelleri
│   │   └── utils/          # Logger, response builder
│   ├── tests/
│   ├── main.py
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/            # API çağrı fonksiyonları
│   │   ├── components/     # Yeniden kullanılabilir bileşenler
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route bazlı sayfalar
│   │   ├── store/          # Zustand global state
│   │   └── types/          # TypeScript tip tanımlamaları
│   └── .env.example
├── docs/
│   └── assets/             # Ekran görüntüleri ve görseller
├── requirements.txt
├── CLAUDE.md               # Proje context dosyası
├── PROGRESS.md             # Geliştirme yol haritası
└── README.md
```

---

## Katkı Sağlama

Katkı sağlamak için lütfen şu adımları izle:

1. Bu repoyu fork'la
2. Yeni bir branch oluştur: `git checkout -b feature/ozellik-adi`
3. Değişikliklerini commit'le (Conventional Commits formatında):
   ```
   feat(orders): geciken sipariş uyarı sistemi eklendi
   ```
4. Branch'ini push'la: `git push origin feature/ozellik-adi`
5. Pull Request aç (`develop` branch'ine)

Detaylı geliştirme kılavuzu için [CLAUDE.md](CLAUDE.md) dosyasına bak.

---

<!-- LICENSE BÖLÜMÜ DAHA SONRA EKLENECEK -->

<div align="center">

Pulsify — KOBİ'lerin AI ile büyümesi için

</div>
