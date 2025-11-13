# Viedais Teksta Redaktors

Moderna web aplikācija teksta analīzei ar AI atbalstu. Atbalsta latviešu, krievu un angļu valodas.

## 🚀 Funkcionalitāte

### 1. Teksta Ievade
- Liels teksta ievades lauks
- Real-time statistika (vārdi, teikumi, rindkopas, rakstzīmes)
- Auto-save funkcionalitāte
- Keyboard shortcuts (Ctrl+Enter analīzei)

### 2. Iestatījumi
- Valodas izvēle (LV/RU/EN)
- Kategorijas izvēle (Ziņas, Sports, Kultūra, Bizness, Viedoklis)
- Stila izvēle (Formāls, Neformāls, Neitrāls)

### 3. Analīzes Sistēma
- Lasāmības rādītājs (Flesch Reading Ease adaptācija)
- Detalizētas metrīkas
- Problēmu identificēšana ar ieteikumiem
- Kopsavilkuma ģenerēšana
- Vizuāls dashboard

### 4. Administrēšana
- Zināšanu bāzes pārvaldība
- Vadlīniju augšupielāde un pārvaldība
- Sistēmas prompta rediģēšana
- Versiju kontrole

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **AI**: Google Gemini 2.5 Pro
- **State Management**: Zustand
- **Storage**: localStorage

## 📦 Instalācija

### Priekšnosacījumi
- Node.js 18+ 
- npm vai yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend būs pieejams uz `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install

# Izveidot .env failu
cp env.example .env

# Rediģēt .env un pievienot Gemini API atslēgu
# GEMINI_API_KEY=your_api_key_here

npm run dev
```

Backend būs pieejams uz `http://localhost:5000`

## 🔑 API Atslēga

Projektā ir iekļauta Gemini API atslēga:
```
AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco
```

## 📚 API Endpoints

### POST /api/analyze
Analizē tekstu un atgriež detalizētus rezultātus.

**Request:**
```json
{
  "text": "Teksts analīzei...",
  "settings": {
    "language": "lv",
    "category": "news",
    "style": "neutral"
  },
  "prompt": "Sistēmas prompts..."
}
```

**Response:**
```json
{
  "readability_score": 75,
  "issues": [...],
  "summary": "Kopsavilkums...",
  "metrics": {...}
}
```

### POST /api/summarize
Ģenerē teksta kopsavilkumu.

### POST /api/suggestions
Atgriež ieteikumus teksta uzlabošanai.

### GET /api/health
Pārbauda servera statusu.

## 🎨 Funkcijas

### Dark Mode
Automātiska dark/light mode pārslēgšana ar saglabāšanu localStorage.

### Responsive Design
Pilnībā responsīvs dizains, kas darbojas uz visām ierīcēm.

### Auto-save
Teksts tiek automātiski saglabāts kā melnraksts.

### Keyboard Shortcuts
- `Ctrl+Enter` - Sākt analīzi

## 📁 Projekta Struktūra

```
viedais-redaktors/
├── frontend/
│   ├── src/
│   │   ├── components/     # React komponentes
│   │   ├── pages/          # Lapas
│   │   ├── services/       # API servisi
│   │   ├── stores/         # Zustand stores
│   │   ├── types/          # TypeScript tipi
│   │   └── utils/          # Utilītas
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Gemini service
│   │   ├── middleware/     # Middleware
│   │   └── utils/          # Utilītas
│   └── package.json
└── README.md
```

## 🔧 Konfigurācija

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
GEMINI_API_KEY=your_api_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Deployment

### Vercel (Ieteicams)

1. Izveidot Vercel projektu
2. Pievienot environment variables
3. Deploy frontend un backend kā serverless functions

```bash
# Frontend
cd frontend
vercel

# Backend
cd backend
vercel
```

## 📝 Lietošanas Instrukcijas

1. **Teksta Ievade**: Ievietojiet vai ierakstiet tekstu
2. **Iestatījumi**: Izvēlieties valodu, kategoriju un stilu
3. **Analīze**: Nospiediet "Analizēt" vai Ctrl+Enter
4. **Rezultāti**: Skatiet detalizētus analīzes rezultātus
5. **Administrēšana**: Pārvaldiet vadlīnijas un sistēmas iestatījumus

## 🎯 Galvenās Metrīkas

- Vārdu skaits
- Teikumu skaits
- Rindkopu skaits
- Vidējais vārdu skaits teikumā
- Lasāmības indekss (0-100)
- Sarežģīto teikumu skaits (>25 vārdi)

## 🔍 Problēmu Tipi

- **Lasāmība**: Pārāk gari vai sarežģīti teikumi
- **Gramatika**: Gramatikas kļūdas
- **Stils**: Stila neatbilstības
- **Sarežģītība**: Pārāk sarežģīts saturs

## 🌐 Valodu Atbalsts

- **Latviešu** (lv): Pilns atbalsts ar adaptētu Flesch Reading Ease
- **Krievu** (ru): Pilns atbalsts ar kirilicas rakstzīmēm
- **Angļu** (en): Standarta Flesch Reading Ease

## 👥 Komanda

Delfi Hakathon 2024

## 📄 Licen