# 📦 Admin Data Persistēšana

## Problēma
Pēc deploy pazuda vadlīnijas un zināšanu bāze, jo dati tika glabāti tikai `localStorage`.

## ✅ Risinājums

### Backend API Endpoints
Izveidoti jauni endpoints admin datu pārvaldībai:

#### Express Backend (Development)
- `GET /api/admin/data` - Iegūt visus admin datus
- `POST /api/admin/guidelines` - Pievienot vadlīniju
- `PUT /api/admin/guidelines/:id` - Atjaunot vadlīniju
- `DELETE /api/admin/guidelines/:id` - Dzēst vadlīniju
- `POST /api/admin/knowledge-base` - Pievienot rakstu
- `DELETE /api/admin/knowledge-base/:id` - Dzēst rakstu
- `POST /api/admin/prompts` - Pievienot prompt
- `PUT /api/admin/active-prompt` - Iestatīt aktīvo prompt

#### Netlify Function (Production)
- `/.netlify/functions/admin-data` - Vienots endpoint ar visu funkcionalitāti
  - Izmanto `/tmp` direktoriju Netlify vidē
  - Dati tiek saglabāti JSON failā

### Storage

#### Development (Express)
```
backend/data/admin-data.json
```
- Dati tiek saglabāti persistenti
- Git ignorē `*.json` failus
- `.gitkeep` saglabā direktoriju

#### Production (Netlify)
```
/tmp/admin-data.json
```
- Netlify izmanto `/tmp` direktoriju
- Dati tiek saglabāti serverless funkcijas lifetime laikā
- Pēc cold start ielādējas default dati

### Frontend Izmaiņas

#### Store Updates
`frontend/src/stores/adminStore.ts`:
- Visas funkcijas tagad ir `async`
- Pievienota `loadFromServer()` funkcija
- Automātiska sinhronizācija ar backend

#### API Funkcijas
`frontend/src/services/api.ts`:
- Pievienotas 8 jaunas admin API funkcijas
- Dual support: Express + Netlify Functions
- Auto-detect pareizo endpoint

#### Auto-Load
`frontend/src/App.tsx`:
- Automātiski ielādē admin datus no servera
- Notiek pie app startup
- Fallback uz localStorage, ja API nav pieejams

## 🚀 Deployment

### Development
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Production (Netlify)
1. Push uz Git
2. Netlify automātiski deploy
3. Admin dati tiek ielādēti no servera
4. Izmaiņas tiek saglabātas `/tmp` direktorijā

## ⚠️ Ierobežojumi

### Netlify Serverless
- Dati `/tmp` tiek notīrīti pēc cold start
- Nav persistent storage bez database
- Apsveriet izmantot:
  - Netlify Blobs
  - External DB (Supabase, MongoDB Atlas)
  - S3/Cloud Storage

### Migrācija uz Database
Ja nepieciešama ilgtermiņa persistēšana produkcijā, ieteicams:

1. **Supabase** (bezmaksas līmenis):
```bash
npm install @supabase/supabase-js
```

2. **MongoDB Atlas** (bezmaksas līmenis):
```bash
npm install mongodb
```

3. **Netlify Blobs**:
```bash
npm install @netlify/blobs
```

## 📝 Lietošana

### Pievienot Vadlīniju
```typescript
import { useAdminStore } from './stores/adminStore';

const { addGuideline } = useAdminStore();

await addGuideline({
  id: Date.now().toString(),
  name: 'Jaunā vadlīnija',
  content: 'Saturs...',
  priority: 5,
  createdAt: new Date().toISOString(),
});
```

### Ielādēt no Servera
```typescript
const { loadFromServer } = useAdminStore();
await loadFromServer();
```

## 🔍 Testēšana

### Lokāli
1. Palaidiet backend: `cd backend && npm run dev`
2. Palaidiet frontend: `cd frontend && npm run dev`
3. Dodieties uz Administrēšana
4. Pievienojiet vadlīniju
5. Pārlādējiet lapu - datiem jāpaliek

### Produkcijā
1. Deploy uz Netlify
2. Dodieties uz Administrēšana
3. Pievienojiet vadlīniju
4. Pārlādējiet lapu - datiem jāpaliek (līdz cold start)

## 🐛 Debug

### Konsolē redzami errori?
```bash
# Pārbaudiet API pieejamību
curl http://localhost:5000/api/admin/data

# Vai Netlify
curl https://your-site.netlify.app/.netlify/functions/admin-data
```

### Dati nepersistējas?
1. Pārbaudiet backend logs
2. Pārbaudiet `backend/data/admin-data.json` eksistē
3. Pārbaudiet CORS iestatījumus
4. Pārbaudiet Network tab browser DevTools

## 📚 Arhitektūra

```
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│  ┌────────────────────────────────────┐ │
│  │   useAdminStore (Zustand)          │ │
│  │   - localStorage cache             │ │
│  │   - sync ar backend                │ │
│  └────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │ HTTP API
                  ▼
┌─────────────────────────────────────────┐
│         Backend                          │
│  ┌────────────────────────────────────┐ │
│  │   Express API (dev)                │ │
│  │   Netlify Functions (prod)         │ │
│  └────────────────────────────────────┘ │
│                 │                        │
│                 ▼                        │
│  ┌────────────────────────────────────┐ │
│  │   File Storage                     │ │
│  │   - backend/data/*.json (dev)      │ │
│  │   - /tmp/*.json (prod)             │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## ✅ Gatavas Funkcijas

- ✅ Backend API (Express + Netlify)
- ✅ File-based storage
- ✅ Frontend sync
- ✅ Auto-load on startup
- ✅ localStorage cache
- ✅ Error handling
- ✅ TypeScript types

## 🔜 Nākamie Soļi

1. **Testēt lokāli**
2. **Deploy uz Netlify**
3. **Testēt produkcijā**
4. **Ja nepieciešams - migrēt uz datubāzi**

