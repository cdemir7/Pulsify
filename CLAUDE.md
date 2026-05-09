# CLAUDE.md — KOBİ AI Asistanı

> Bu dosya, KOBİ AI Asistanı projesinin kalıcı context dosyasıdır.
> Claude Code, Cursor ve tüm AI destekli geliştirme araçları bu dosyayı
> proje bağlamını anlamak için birincil kaynak olarak kullanmalıdır.
> Her yeni oturumda bu dosyayı oku ve içeriğe sadık kal.

---

## İçindekiler

1. [Proje Vizyonu](#1-proje-vizyonu)
2. [Sistem Mimarisi](#2-sistem-mimarisi)
3. [Frontend Yapısı](#3-frontend-yapısı)
4. [Backend Yapısı](#4-backend-yapısı)
5. [NoSQL Database Organizasyonu](#5-nosql-database-organizasyonu)
6. [API Standartları](#6-api-standartları)
7. [AI Service Layer Yapısı](#7-ai-service-layer-yapısı)
8. [Kod Standartları](#8-kod-standartları)
9. [Güvenlik Kuralları](#9-güvenlik-kuralları)
10. [Deployment Stratejisi](#10-deployment-stratejisi)
11. [MVP Öncelikleri](#11-mvp-öncelikleri)
12. [Gelecek Ölçeklenme Planı](#12-gelecek-ölçeklenme-planı)
13. [Developer Workflow](#13-developer-workflow)
14. [Claude Prompt Kullanım Stratejisi](#14-claude-prompt-kullanım-stratejisi)
15. [Teknik Riskler](#15-teknik-riskler)

---

## 1. Proje Vizyonu

### Proje Adı
**KOBİ AI Asistanı** — `Pulsify`

### Amaç
KOBİ'lerin müşteri iletişimi, sipariş yönetimi, kargo takibi, müşteri memnuniyeti
ve operasyon süreçlerini AI destekli otomasyon ile yönetmesini sağlayan modern bir platform.

### Hedef Kullanıcılar
- Küçük ve orta ölçekli işletmeler (KOBİ)
- E-ticaret işletmeleri
- Operasyon ekipleri
- Müşteri destek ekipleri

### Temel Değer Önerileri
| Özellik | Açıklama |
|---|---|
| AI-first | Her operasyonel karar yapay zeka desteklidir |
| Türkçe NLP | Doğal dil desteği Türkçe odaklıdır |
| Otomasyon | Manuel süreçler minimize edilir |
| Gerçek zamanlılık | Sipariş ve kargo anlık takip edilir |
| Sadelik | KOBİ personelinin kolayca kullanabileceği UX |

### Geliştirme Felsefesi
- **MVP-first**: Önce çalışan, sonra mükemmel
- **Pragmatic architecture**: Over-engineering yasak
- **AI-assisted development**: Claude ve Gemini ikisi de geliştirme sürecinde aktif
- **Hızlı iterasyon**: Haftalık sprint döngüleri

---

## 2. Sistem Mimarisi

### Genel Mimari

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                       │
│              React + TypeScript + TailwindCSS           │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS / REST
┌───────────────────────▼─────────────────────────────────┐
│                      API LAYER                          │
│                   Flask (Python)                        │
│              REST API + Blueprint Router                │
└──────┬──────────────────────────┬───────────────────────┘
       │                          │
┌──────▼──────┐          ┌────────▼────────┐
│   MongoDB   │          │  Gemini API     │
│  (NoSQL DB) │          │  (AI Service)   │
└─────────────┘          └─────────────────┘
```

### Katman Sorumlulukları
- **Frontend**: UI render, kullanıcı etkileşimi, state yönetimi
- **Flask API**: İş mantığı, doğrulama, yönlendirme, AI orchestration
- **MongoDB**: Kalıcı veri depolama, sorgulama
- **Gemini API**: NLP, duygu analizi, rapor üretimi, intent recognition

### Mimari Kararların Gerekçeleri
- **Flask** seçildi çünkü: Hafif, hızlı prototipleme, Python ekosistemi ile uyumlu, Gemini SDK doğrudan destekli
- **MongoDB** seçildi çünkü: Sipariş/müşteri veri yapıları schema-flexible, NoSQL ölçeklenme avantajlı, JSON-native
- **React** seçildi çünkü: Component reusability, geniş ekosistem, TypeScript desteği
- **Gemini API** seçildi çünkü: Türkçe dil desteği güçlü, maliyet avantajlı, Google altyapısı

---

## 3. Frontend Yapısı

### Klasör Yapısı

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/                  # API çağrı fonksiyonları
│   │   ├── orders.ts
│   │   ├── customers.ts
│   │   ├── cargo.ts
│   │   └── ai.ts
│   ├── components/           # Yeniden kullanılabilir bileşenler
│   │   ├── common/           # Button, Input, Modal, Badge vb.
│   │   ├── layout/           # Sidebar, Navbar, PageWrapper
│   │   ├── dashboard/        # Dashboard'a özgü widget'lar
│   │   ├── orders/           # Sipariş bileşenleri
│   │   ├── customers/        # Müşteri bileşenleri
│   │   ├── cargo/            # Kargo bileşenleri
│   │   └── chatbot/          # AI chatbot bileşenleri
│   ├── hooks/                # Custom React hooks
│   │   ├── useOrders.ts
│   │   ├── useCustomers.ts
│   │   └── useAI.ts
│   ├── pages/                # Sayfa bileşenleri (route bazlı)
│   │   ├── Dashboard.tsx
│   │   ├── Orders.tsx
│   │   ├── Cargo.tsx
│   │   ├── Customers.tsx
│   │   └── Chatbot.tsx
│   ├── store/                # Global state (Zustand)
│   │   ├── useOrderStore.ts
│   │   ├── useCustomerStore.ts
│   │   └── useAppStore.ts
│   ├── types/                # TypeScript tip tanımlamaları
│   │   ├── order.types.ts
│   │   ├── customer.types.ts
│   │   └── api.types.ts
│   ├── utils/                # Yardımcı fonksiyonlar
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

### State Management
**Zustand** kullan — Context API yerine tercih sebebi: daha az boilerplate, daha iyi performans, TypeScript uyumu.

```typescript
// Örnek store yapısı
interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => void;
}
```

### Component Architecture Kuralları
- Her component kendi klasöründe: `ComponentName/index.tsx` + `ComponentName.types.ts`
- Props interface'i her zaman tanımla, `any` kullanma
- Side effect'ler custom hook içinde olmalı, component'te değil
- API çağrıları doğrudan component içinde yapılmaz — `api/` katmanından geçer

### Routing
React Router v6 kullan:

```typescript
// Sayfa yapısı
/dashboard        → Dashboard.tsx
/orders           → Orders.tsx
/cargo            → Cargo.tsx
/customers        → Customers.tsx
/chatbot          → Chatbot.tsx
```

---

## 4. Backend Yapısı

### Klasör Yapısı

```
backend/
├── app/
│   ├── __init__.py           # Flask app factory
│   ├── config.py             # Ortam bazlı konfigürasyon
│   ├── extensions.py         # PyMongo, CORS vb. init
│   ├── blueprints/           # Route grupları
│   │   ├── orders/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── schemas.py
│   │   ├── customers/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── schemas.py
│   │   ├── cargo/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── schemas.py
│   │   └── ai/
│   │       ├── __init__.py
│   │       ├── routes.py
│   │       └── schemas.py
│   ├── services/             # İş mantığı katmanı
│   │   ├── order_service.py
│   │   ├── customer_service.py
│   │   ├── cargo_service.py
│   │   └── ai_service.py
│   ├── models/               # MongoDB collection şemaları (Pydantic)
│   │   ├── order.py
│   │   ├── customer.py
│   │   └── product.py
│   └── utils/
│       ├── response.py       # Standart API response builder
│       ├── validators.py
│       └── logger.py
├── tests/
│   ├── test_orders.py
│   ├── test_customers.py
│   └── test_ai.py
├── .env
├── .env.example
├── requirements.txt
├── run.py
└── Procfile                  # Render/Railway deployment
```

### Flask App Factory

```python
# app/__init__.py
from flask import Flask
from flask_cors import CORS
from app.extensions import mongo
from app.blueprints.orders import orders_bp
from app.blueprints.customers import customers_bp
from app.blueprints.cargo import cargo_bp
from app.blueprints.ai import ai_bp

def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    mongo.init_app(app)

    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(customers_bp, url_prefix="/api/customers")
    app.register_blueprint(cargo_bp, url_prefix="/api/cargo")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    return app
```

### Konfigürasyon Yönetimi

```python
# app/config.py
import os

class Config:
    MONGO_URI = os.getenv("MONGO_URI")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
```

---

## 5. NoSQL Database Organizasyonu

### MongoDB Collection Yapıları

#### `orders` Collection

```json
{
  "_id": "ObjectId",
  "order_code": "ORD-2024-00123",
  "customer_id": "ObjectId (ref: customers)",
  "customer_name": "string",
  "product": "string",
  "amount": "float",
  "status": "pending | processing | shipped | delivered | cancelled",
  "cargo_status": "not_shipped | in_transit | delayed | delivered",
  "cargo_company": "string",
  "tracking_number": "string",
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "estimated_delivery": "ISODate"
}
```

#### `customers` Collection

```json
{
  "_id": "ObjectId",
  "name": "string",
  "phone": "string",
  "email": "string",
  "loyalty_score": "int (0-100)",
  "sentiment": "happy | neutral | angry",
  "sentiment_history": [
    { "sentiment": "string", "date": "ISODate", "message_ref": "string" }
  ],
  "last_order_date": "ISODate",
  "total_orders": "int",
  "total_spent": "float",
  "created_at": "ISODate"
}
```

#### `products` Collection

```json
{
  "_id": "ObjectId",
  "product_name": "string",
  "category": "string",
  "stock_quantity": "int",
  "critical_threshold": "int",
  "price": "float",
  "is_active": "boolean",
  "updated_at": "ISODate"
}
```

#### `ai_reports` Collection

```json
{
  "_id": "ObjectId",
  "report_type": "daily_summary | cargo_alert | sentiment_alert",
  "content": "string",
  "generated_at": "ISODate",
  "metadata": {
    "delayed_orders_count": "int",
    "angry_customers_count": "int",
    "low_stock_count": "int"
  }
}
```

### İndeksleme Stratejisi
```
orders:       { customer_id: 1 }, { status: 1 }, { created_at: -1 }
customers:    { phone: 1 (unique) }, { sentiment: 1 }, { loyalty_score: -1 }
products:     { category: 1 }, { stock_quantity: 1 }
ai_reports:   { report_type: 1 }, { generated_at: -1 }
```

---

## 6. API Standartları

### URL Yapısı
```
/api/{resource}           GET    → liste
/api/{resource}/{id}      GET    → tekil
/api/{resource}           POST   → oluştur
/api/{resource}/{id}      PUT    → güncelle
/api/{resource}/{id}      DELETE → sil
/api/ai/{action}          POST   → AI işlem
```

### Standart Response Formatı

```json
// Başarılı response
{
  "success": true,
  "data": { ... },
  "message": "İşlem başarılı",
  "meta": {
    "page": 1,
    "total": 120,
    "per_page": 20
  }
}

// Hata response
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Sipariş bulunamadı",
    "detail": "id=abc123 olan sipariş mevcut değil"
  }
}
```

### Response Builder Utility

```python
# app/utils/response.py
from flask import jsonify

def success(data=None, message="OK", meta=None, status=200):
    response = {"success": True, "data": data, "message": message}
    if meta:
        response["meta"] = meta
    return jsonify(response), status

def error(code, message, detail=None, status=400):
    response = {
        "success": False,
        "error": {"code": code, "message": message}
    }
    if detail:
        response["error"]["detail"] = detail
    return jsonify(response), status
```

### HTTP Durum Kodları
| Kod | Kullanım |
|---|---|
| 200 | Başarılı GET, PUT |
| 201 | Başarılı POST (kayıt oluşturma) |
| 400 | Geçersiz istek / validasyon hatası |
| 401 | Kimlik doğrulama gerekli |
| 403 | Yetkisiz erişim |
| 404 | Kayıt bulunamadı |
| 500 | Sunucu hatası |

---

## 7. AI Service Layer Yapısı

### Gemini Entegrasyonu

```python
# app/services/ai_service.py
import google.generativeai as genai
from app.config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

class AIService:

    @staticmethod
    def analyze_sentiment(message: str) -> dict:
        prompt = f"""
        Aşağıdaki müşteri mesajının duygu durumunu analiz et.
        Yalnızca JSON formatında yanıt ver:
        {{"sentiment": "happy|neutral|angry", "confidence": 0.0-1.0, "reason": "kısa açıklama"}}

        Mesaj: {message}
        """
        response = model.generate_content(prompt)
        return parse_json_response(response.text)

    @staticmethod
    def generate_daily_report(data: dict) -> str:
        prompt = f"""
        Aşağıdaki operasyon verilerine göre Türkçe günlük özet rapor üret.
        Riskli durumları vurgula. Net ve profesyonel ol.

        Veri: {data}
        """
        response = model.generate_content(prompt)
        return response.text

    @staticmethod
    def classify_intent(message: str) -> dict:
        prompt = f"""
        Müşteri mesajının niyetini belirle.
        Yalnızca JSON formatında yanıt ver:
        {{"intent": "order_query|cargo_query|complaint|other", "entities": {{}}}}

        Mesaj: {message}
        """
        response = model.generate_content(prompt)
        return parse_json_response(response.text)
```

### AI Endpoint'leri
```
POST /api/ai/sentiment          → Duygu analizi
POST /api/ai/chat               → Chatbot yanıtı
POST /api/ai/report/daily       → Günlük rapor üret
POST /api/ai/loyalty/:id        → Müşteri sadakat analizi
POST /api/ai/cargo-alerts       → Kargo risk analizi
```

### Gemini Prompt Prensipleri
- Her prompt **Türkçe** yanıt talep etmeli
- JSON yanıt beklenen durumlarda format **prompt içinde** belirtilmeli
- Prompt'lara context verisi **sınırlı** tutulmalı (token tasarrufu)
- Rate limit için **exponential backoff** uygulanmalı
- Gemini yanıtları cache'lenmeli (aynı gün tekrar rapor üretme)

---

## 8. Kod Standartları

### Naming Conventions

| Kapsam | Kural | Örnek |
|---|---|---|
| Python dosyası | snake_case | `order_service.py` |
| Python sınıfı | PascalCase | `OrderService` |
| Python fonksiyon | snake_case | `get_orders_by_customer()` |
| Python sabit | UPPER_SNAKE | `MAX_RETRY_COUNT = 3` |
| React component | PascalCase | `OrderCard.tsx` |
| React hook | camelCase + use | `useOrderStore.ts` |
| TypeScript tip | PascalCase | `OrderStatus` |
| CSS class | kebab-case (Tailwind) | `bg-slate-800` |
| MongoDB collection | snake_case plural | `orders`, `ai_reports` |
| API endpoint | kebab-case | `/api/cargo-alerts` |
| Git branch | kebab-case | `feature/cargo-tracking` |
| Env variable | UPPER_SNAKE | `GEMINI_API_KEY` |

### Environment Variables

```bash
# backend/.env.example
FLASK_ENV=development
SECRET_KEY=your-secret-key
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/pulsify
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGINS=http://localhost:5173

# frontend/.env.example
VITE_API_BASE_URL=http://localhost:5000
```

### Error Handling Standardı

```python
# Python — Blueprint seviyesinde hata yakalama
from app.utils.response import error
from app.utils.logger import logger

@orders_bp.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
    return error("INTERNAL_ERROR", "Sunucu hatası oluştu", status=500)
```

```typescript
// TypeScript — API katmanında hata yönetimi
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const res = await axios.get("/api/orders");
    return res.data.data;
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.error?.message
      : "Bilinmeyen hata";
    throw new Error(message);
  }
};
```

### Logging Yaklaşımı

```python
# app/utils/logger.py
import logging
import sys

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger

logger = get_logger("pulsify")
```

Log seviyeleri:
- `INFO` → Normal operasyon akışı
- `WARNING` → Geciken kargo, kritik stok
- `ERROR` → API hatası, DB bağlantı sorunu
- `CRITICAL` → Sistem çöküşü

---

## 9. Güvenlik Kuralları

### Temel Kurallar
- **API key'ler asla frontend'de olmaz** — tüm Gemini çağrıları backend üzerinden
- **`.env` dosyaları asla commit'lenmez** — `.gitignore`'a ekle
- **CORS** sadece izinli origin'lere açık olmalı (production'da wildcard `*` yasak)
- **Input validation** her endpoint'te zorunlu (Marshmallow veya Pydantic ile)
- **MongoDB injection** önlemi: parametrik sorgular kullan, string concat etme

### `.gitignore` — Mutlaka Olması Gerekenler
```
# Backend
.env
__pycache__/
*.pyc
venv/

# Frontend
.env
.env.local
node_modules/
dist/

# Genel
.DS_Store
*.log
```

### Production Güvenlik Checklist
- [ ] `DEBUG=False` olarak ayarla
- [ ] `SECRET_KEY` güçlü ve random üret
- [ ] CORS `CORS_ORIGINS` environment variable'dan oku
- [ ] MongoDB URI'da authentication zorunlu
- [ ] HTTPS zorunlu (Vercel ve Render varsayılan olarak sağlar)
- [ ] Rate limiting ekle (Flask-Limiter)

---

## 10. Deployment Stratejisi

### Platform Seçimleri
| Katman | Platform | Neden |
|---|---|---|
| Frontend | Vercel | Otomatik CI/CD, ücretsiz tier, hızlı CDN |
| Backend | Render / Railway | Flask desteği, env variable yönetimi, ücretsiz tier |
| Database | MongoDB Atlas | Yönetilen servis, ücretsiz 512MB tier, cloud-native |

### Environment Yapısı
```
development  → local (localhost:5000 + localhost:5173)
production   → Vercel (frontend) + Render (backend) + Atlas (DB)
```

### Deployment Adımları

**Backend (Render):**
1. `Procfile` oluştur: `web: gunicorn run:app`
2. `requirements.txt` güncel tut
3. Render dashboard'dan environment variables ekle
4. GitHub repo'ya bağla → otomatik deploy

**Frontend (Vercel):**
1. Vercel CLI veya dashboard ile GitHub'a bağla
2. `VITE_API_BASE_URL` environment variable'ı production backend URL'ine ayarla
3. Her `main` push'unda otomatik deploy

**Database (MongoDB Atlas):**
1. Free tier cluster oluştur
2. IP whitelist: Render'ın IP aralığını ekle
3. Connection string'i backend'e `MONGO_URI` olarak ekle

---

## 11. MVP Öncelikleri

### Sprint 1 — Temel Altyapı
- [ ] Flask app factory kurulumu
- [ ] MongoDB bağlantısı ve temel CRUD
- [ ] React + Vite + TailwindCSS kurulumu
- [ ] Temel routing yapısı
- [ ] Gemini API bağlantısı testi

### Sprint 2 — Core Features
- [ ] Sipariş listeleme ve detay sayfası
- [ ] Müşteri paneli (temel)
- [ ] Kargo durumu görüntüleme
- [ ] Dashboard widget'ları (özet kartlar)

### Sprint 3 — AI Özellikleri
- [ ] Chatbot arayüzü ve Gemini entegrasyonu
- [ ] Duygu analizi servisi
- [ ] Günlük AI raporu
- [ ] Geciken kargo uyarı sistemi

### Sprint 4 — Polish & Deploy
- [ ] Responsive tasarım düzenlemeleri
- [ ] Error handling ve loading states
- [ ] Production deployment
- [ ] Temel test yazımı

### MVP Dışı Bırakılanlar (Sonraki Versiyon)
- Kullanıcı authentication sistemi
- Multi-tenant yapı
- E-posta/SMS bildirim entegrasyonu
- Mobil uygulama
- Gelişmiş analytics

---

## 12. Gelecek Ölçeklenme Planı

### v2.0 Özellikleri
- **Auth sistemi**: JWT tabanlı, rol yönetimi (admin / operasyon / destek)
- **Multi-tenant**: Her KOBİ izole veritabanı namespace'i
- **Bildirim sistemi**: E-posta (SendGrid) ve SMS entegrasyonu
- **Webhook desteği**: Kargo firmaları ile gerçek zamanlı entegrasyon

### v3.0 Özellikleri
- **Mikro servis geçişi**: AI servisi ayrı container olarak
- **Redis cache**: Sık sorgulanan veri için
- **Background jobs**: Celery ile asenkron AI rapor üretimi
- **Analytics dashboard**: Recharts ile gelişmiş görselleştirme
- **API versioning**: `/api/v1/` → `/api/v2/` hazırlığı

### Ölçeklenme Kararları Şimdi Alınmalı
- MongoDB şema değişikliklerine hazır olacak şekilde `updated_at` tüm collection'larda olmalı
- API response formatı standart tutulmalı (breaking change önlemi)
- Tüm servisler stateless olmalı (horizontal scaling için)

---

## 13. Developer Workflow

### Git Branch Stratejisi
```
main          → Production-ready, doğrudan push yasak
develop       → Aktif geliştirme branch'i
feature/*     → Yeni özellik geliştirme
fix/*         → Bug düzeltme
hotfix/*      → Production acil düzeltme
```

### Günlük İş Akışı
```bash
# 1. Güncel kodu çek
git checkout develop
git pull origin develop

# 2. Yeni branch aç
git checkout -b feature/cargo-alert-system

# 3. Geliştir, commit at
git add .
git commit -m "feat(cargo): geciken sipariş uyarı servisi eklendi"

# 4. Push et
git push origin feature/cargo-alert-system

# 5. Pull Request aç → develop'a merge
```

### Commit Convention (Conventional Commits)
```
feat(scope):     Yeni özellik
fix(scope):      Bug düzeltme
refactor(scope): Yapısal değişiklik (özellik/bug yok)
docs(scope):     Dokümantasyon
style(scope):    Kod formatı (işlevsel değişiklik yok)
test(scope):     Test ekleme/düzenleme
chore(scope):    Bağımlılık, config değişiklikleri

Örnekler:
feat(chatbot): Türkçe duygu analizi eklendi
fix(orders): geciken sipariş filtresi düzeltildi
docs(api): sipariş endpoint'leri dokümante edildi
```

### Pull Request Kuralları
- PR başlığı commit convention formatında olmalı
- En az 1 reviewer onayı gerekli
- `develop` branch'i korumalı: direct push yasak
- `main` branch'i korumalı: sadece `develop`'tan merge

### Local Geliştirme Kurulumu

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # .env içini doldur
python run.py

# Frontend
cd frontend
npm install
cp .env.example .env.local      # .env.local içini doldur
npm run dev
```

---

## 14. Claude Prompt Kullanım Stratejisi

### Yeni Oturum Başlangıcı
Her yeni Claude oturumunda şunu söyle:

> "CLAUDE.md dosyasını oku. Bu proje KOBİ AI Asistanı (Pulsify). Flask + MongoDB + React + Gemini stack'i kullanıyoruz. [Yapmak istediğin şeyi açıkla]"

### Etkili Prompt Kalıpları

**Yeni özellik geliştirme:**
```
Pulsify projesinde [özellik adı] geliştireceğim.
Stack: Flask backend, MongoDB, React + TypeScript frontend.
Mevcut klasör yapısı CLAUDE.md'de tanımlı.
[Özelliği] implement et, CLAUDE.md'deki standartlara uy.
```

**Bug düzeltme:**
```
Pulsify'da şu hata oluyor: [hata mesajı]
İlgili dosya: [dosya yolu]
Mevcut kod: [kod bloğu]
Düzelt ve sebebini açıkla.
```

**Code review:**
```
Pulsify projesinin CLAUDE.md standartlarına göre
şu kodu review et: [kod]
Naming convention, error handling ve güvenlik açısından değerlendir.
```

### Claude'a Verme, Yapmasını İsteme
- ❌ "Bir chatbot yap" → Çok belirsiz
- ✅ "Pulsify'ın `/api/ai/chat` endpoint'ini yaz. Gemini API'ye müşteri mesajını gönder, intent classify et, MongoDB'den sipariş bilgisi çek, Türkçe yanıt üret. CLAUDE.md'deki response formatını kullan."

---

## 15. Teknik Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Gemini API rate limit | Orta | Yüksek | Exponential backoff, response cache |
| MongoDB free tier dolması | Düşük | Orta | Veri temizleme rutini, arşivleme |
| CORS hataları production'da | Yüksek | Orta | Origin whitelist env variable'dan yönet |
| Gemini Türkçe NLP kalitesi | Orta | Orta | Prompt engineering ile iyileştir, test et |
| Frontend/Backend senkronizasyon hatası | Orta | Yüksek | API type'larını TypeScript ile paylaş |
| Secret key/API key sızıntısı | Düşük | Çok Yüksek | `.env` gitignore, secret scanning aktif et |
| Render cold start gecikmesi | Yüksek | Düşük | Ping servisi veya ücretli plan |

### Flask + Gemini Özel Riskler
- Gemini `generate_content()` blocking call'dır — yoğun istekte Flask bloklanabilir
- Önlem: `threading` veya ileride `async Flask (Quart)` geçişi planla
- Gemini yanıtları tutarsız JSON üretebilir — her zaman `try/except` ile parse et

---

*Son güncelleme: Proje başlangıcı — Bu dosya projeyle birlikte evrilmeli, her büyük mimari karar buraya yansıtılmalıdır.*
