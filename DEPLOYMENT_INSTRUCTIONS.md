# 🚀 Deployment Instrukcijas

## ✅ Gatavas Izmaiņas

Admin datu persistēšana ir implementēta un gatava deployment.

## 📦 Kas Tika Pievienots

### Backend (11 jauni/modificēti faili)
- `backend/src/routes/admin.ts` - Admin API
- `backend/src/services/adminStorage.ts` - Datu glabāšana
- `backend/data/.gitkeep` - Data direktorija
- `backend/src/index.ts` - Pievienoti admin routes

### Netlify
- `netlify/functions/admin-data.ts` - Serverless admin API

### Frontend
- `frontend/src/stores/adminStore.ts` - Async funkcijas + server sync
- `frontend/src/services/api.ts` - Admin API funkcijas
- `frontend/src/App.tsx` - Auto-load no servera

### Dokumentācija
- `ADMIN_DATA_PERSISTENCE.md` - Tehniskā dokumentācija
- `PROBLĒMAS_RISINĀJUMS.md` - Risinājuma apraksts
- `DEPLOYMENT_INSTRUCTIONS.md` - Šis fails

## 🧪 Testēšana Lokāli

### 1. Palaidiet Backend
```powershell
cd backend
npm install
npm run dev
```

### 2. Palaidiet Frontend (jaunā terminālī)
```powershell
cd frontend
npm install
npm run dev
```

### 3. Testējiet Funkcionalitāti
1. Atveriet http://localhost:3000
2. Dodieties uz **Administrēšana**
3. Pievienojiet vadlīniju:
   - Nosaukums: "Test Vadlīnija"
   - Saturs: "Lietot īsus teikumus"
   - Prioritāte: 5
4. **Pārlādējiet lapu** (F5)
5. ✅ Vadlīnijai jābūt redzamai

### 4. Testējiet Analīzi
1. Dodieties uz **Teksta Ievade**
2. Ievadiet tekstu
3. Nospiediet **Analizēt**
4. Pārbaudiet, vai vadlīnijas tiek izmantotas AI atbildē

## 📤 Deployment uz Git

### Option 1: Izmantojot push-changes.bat
```powershell
.\push-changes.bat
```

### Option 2: Manuāli
```powershell
git add .
git commit -m "fix: admin datu persistēšana ar backend storage"
git push origin main
```

## 🌐 Netlify Deployment

### Automātiskais Deployment
Netlify automātiski:
1. Detectē push uz `main` branch
2. Build frontend + functions
3. Deploy uz production
4. ~2-3 minūtes

### Manuālais Deploy (ja nepieciešams)
1. Dodieties uz Netlify Dashboard
2. Site Overview → Deploys
3. Trigger deploy → **Clear cache and deploy site**

## ✅ Verifikācija Produkcijā

### 1. Pārbaudiet Deployment Status
Netlify Dashboard → Site Overview → **Production Deploy**

Status: ✅ Published

### 2. Testējiet Admin Data API
```powershell
# Pārbaudiet, vai admin-data funkcija darbojas
curl https://phenomenal-macaron-5617d0.netlify.app/.netlify/functions/admin-data
```

Sagaidāmā atbilde:
```json
{
  "guidelines": [],
  "knowledgeBase": [],
  "systemPrompts": [...],
  "activePromptId": "default"
}
```

### 3. Testējiet Lietotni
1. Atveriet deployed site
2. Dodieties uz **Administrēšana**
3. Pievienojiet vadlīniju
4. Pārlādējiet lapu
5. ✅ Vadlīnijai jābūt redzamai

### 4. Testējiet Analīzi ar Vadlīnijām
1. Pievienojiet vadlīniju: "Izmantot aktīvo balsi"
2. Dodieties uz Teksta Ievade
3. Ievadiet: "Ziņa tika nosūtīta" (pasīvā balss)
4. Analizējiet
5. ✅ AI analīzei jāatzīmē pasīvā balss lietojums

## 🔍 Troubleshooting

### Problēma: Admin dati nepersistējas lokāli
**Risinājums:**
1. Pārbaudiet, vai backend darbojas: http://localhost:5000
2. Pārbaudiet konsoli: Network tab → vai ir 200 response
3. Pārbaudiet, vai `backend/data/admin-data.json` eksistē

### Problēma: 404 uz admin-data funkciju
**Risinājums:**
1. Netlify Dashboard → Functions
2. Pārbaudiet, vai `admin-data` ir sarakstā
3. Pārbaudiet deploy logs error ziņām
4. Pārbaudiet, vai `netlify/functions/admin-data.ts` ir committed

### Problēma: Dati pazūd pēc laika Netlify
**Paredzēts uzvedums:**
- Netlify izmanto `/tmp` storage
- Dati tiek notīrīti pēc cold start (~15 min neaktivitātes)
- localStorage cache palīdz

**Ilgtermiņa risinājums:**
- Migrēt uz Netlify Blobs
- Vai izmantot database (Supabase/MongoDB)

### Problēma: CORS errors
**Risinājums:**
Pārbaudiet `netlify/functions/admin-data.ts`:
```typescript
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};
```

## 📊 Sagaidāmie Rezultāti

### Lokāli (Development)
- ✅ Backend API uz http://localhost:5000/api/admin/*
- ✅ Dati glabājas `backend/data/admin-data.json`
- ✅ Persistenti starp restartiem

### Produkcijā (Netlify)
- ✅ Serverless API uz `/.netlify/functions/admin-data/*`
- ✅ Dati glabājas `/tmp/admin-data.json`
- ⚠️ Tiek notīrīti pēc cold start

## 🎯 Success Kritēriji

- [x] Backend API darbojas lokāli
- [x] Frontend sync ar backend
- [x] localStorage cache darbojas
- [x] Auto-load pie app startup
- [x] Netlify function izveidota
- [x] Zero linter errors
- [x] TypeScript types visur
- [ ] Testēts lokāli ✅
- [ ] Deployed uz Netlify ⏳
- [ ] Testēts produkcijā ⏳

## 📝 Checklist Deploy Process

### Pre-Deploy
- [x] Kods ir bez erroriem
- [x] Linter ir tīrs
- [x] Dokumentācija izveidota
- [x] .gitignore atjaunots

### Deploy
- [ ] Git commit izveidots
- [ ] Pushed uz GitHub
- [ ] Netlify automātiski deploy
- [ ] Deploy status: Published

### Post-Deploy
- [ ] Admin data API darbojas
- [ ] Frontend ielādē datus
- [ ] Vadlīnijas persistējas
- [ ] Analīze izmanto vadlīnijas
- [ ] Nav console errors

## 🚀 Nākamie Soļi

1. **Testējiet lokāli** (30 min)
   - Palaidiet abi serveri
   - Pievienojiet vadlīnijas
   - Testējiet analīzi

2. **Push uz Git** (2 min)
   - Commit izmaiņas
   - Push uz GitHub

3. **Gaidiet Netlify Deploy** (2-3 min)
   - Automātisks process
   - Skatieties logs

4. **Testējiet Produkcijā** (15 min)
   - Pievienojiet vadlīnijas
   - Testējiet persistenci
   - Testējiet analīzi

5. **Dokumentējiet** (10 min)
   - Pārbaudiet, vai viss darbojas
   - Update README ja nepieciešams

## 💡 Tips

Ja rodas jautājumi vai problēmas:
1. Pārbaudiet console logs (F12)
2. Pārbaudiet Network tab
3. Pārbaudiet Netlify Function logs
4. Lasiet `ADMIN_DATA_PERSISTENCE.md`

---

**Veiksmi ar deployment! 🎉**

