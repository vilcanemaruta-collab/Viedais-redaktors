# 🚀 START HERE - Viedais Teksta Redaktors

Sveicināti! Šis ir jūsu ceļvedis, lai sāktu darbu ar Viedo Teksta Redaktoru.

## ⚡ Ātrā Palaišana (5 minūtes)

### 1️⃣ Instalējiet Dependencies

```bash
# No projekta root direktorijas
npm run install:all
```

Vai manuāli:
```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2️⃣ Konfigurējiet Environment Variables

**Frontend** (`frontend/.env`):
```bash
echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env
```

**Backend** (`backend/.env`):
```bash
echo "PORT=5000" > backend/.env
echo "GEMINI_API_KEY=AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco" >> backend/.env
echo "NODE_ENV=development" >> backend/.env
echo "CORS_ORIGIN=http://localhost:3000" >> backend/.env
```

### 3️⃣ Palaidiet Aplikāciju

**Variants 1: Abi serveri vienlaicīgi (ieteicams)**
```bash
npm run dev
```

**Variants 2: Atsevišķi**

Terminal 1 (Frontend):
```bash
npm run dev:frontend
```

Terminal 2 (Backend):
```bash
npm run dev:backend
```

### 4️⃣ Atveriet Pārlūkā

Dodieties uz: **http://localhost:3000**

---

## 📚 Kas Tālāk?

### Pirmā Lietošana

1. **Ievadiet tekstu** - Sāciet ar vienkāršu testu:
   ```
   Latvijas futbola izlase šodien spēlēja pret Igauniju. Spēle beidzās ar rezultātu 2:1.
   ```

2. **Iestatiet parametrus** - Dodieties uz Iestatījumi:
   - Valoda: Latviešu
   - Kategorija: Sports
   - Stils: Neitrāls

3. **Analizējiet** - Nospiediet "Analizēt" vai Ctrl+Enter

4. **Skatiet rezultātus** - Redzēsiet:
   - Lasāmības rādītāju
   - Detalizētas metrīkas
   - Ieteikumus uzlabošanai
   - AI ģenerētu kopsavilkumu

### Pievienojiet Vadlīnijas

1. Dodieties uz **Administrēšana**
2. Izvēlieties **Vadlīnijas** tab
3. Noklikšķiniet **Pievienot**
4. Iekopējiet vadlīnijas no `sample-guidelines.md`
5. Iestatiet prioritāti (1-10)
6. Saglabājiet

### Testējiet Visas Valodas

**Latviešu:**
```
Valdība šodien pieņēma jaunu likumu. Likums stāsies spēkā nākamgad.
```

**Krievu:**
```
Правительство сегодня приняло новый закон. Закон вступит в силу в следующем году.
```

**Angļu:**
```
The government passed a new law today. The law will take effect next year.
```

---

## 📖 Dokumentācija

Izvēlieties atbilstošu dokumentu:

| Dokuments | Kad Izmantot |
|-----------|--------------|
| **QUICKSTART.md** | Detalizētas palaišanas instrukcijas |
| **README.md** | Pilna projekta dokumentācija |
| **TESTING.md** | Testēšanas stratēģija un piemēri |
| **DEPLOYMENT.md** | Kā deploy uz production |
| **CONTRIBUTING.md** | Kā piedalīties projektā |
| **PROJECT_SUMMARY.md** | Projekta pārskats un statistika |

---

## 🎯 Galvenās Funkcijas

### ✅ 4 Galvenās Komponentes

1. **Teksta Ievade**
   - Real-time statistika
   - Auto-save
   - Keyboard shortcuts

2. **Iestatījumi**
   - 3 valodas (LV, RU, EN)
   - 5 kategorijas
   - 3 stili

3. **Analīze**
   - Lasāmības indekss
   - 6+ metrīkas
   - AI ieteikumi
   - Kopsavilkums

4. **Administrēšana**
   - Vadlīniju pārvaldība
   - Zināšanu bāze
   - Prompta rediģēšana

### 🎨 UI Funkcijas

- ✅ Dark/Light mode
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Loading states
- ✅ Smooth animations

---

## 🔧 Troubleshooting

### Problēma: Frontend neielādējas

**Risinājums:**
```bash
# Pārbaudiet vai ports 3000 ir brīvs
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Ja aizņemts, mainiet portu vite.config.ts
```

### Problēma: Backend neatbild

**Risinājums:**
```bash
# Pārbaudiet vai .env fails eksistē
cat backend/.env

# Pārbaudiet vai ports 5000 ir brīvs
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Skatiet backend logs
cd backend && npm run dev
```

### Problēma: "Failed to analyze text"

**Iespējamie cēloņi:**
1. Backend nedarbojas
2. Nepareizs API URL frontend .env
3. Gemini API key problēmas
4. CORS kļūda

**Risinājums:**
```bash
# 1. Pārbaudiet vai backend darbojas
curl http://localhost:5000/api/health

# 2. Pārbaudiet frontend .env
cat frontend/.env

# 3. Pārbaudiet backend .env
cat backend/.env

# 4. Skatiet browser console (F12)
```

### Problēma: CORS Error

**Risinājums:**
```bash
# Pārliecinieties, ka backend .env satur:
echo "CORS_ORIGIN=http://localhost:3000" >> backend/.env

# Restartējiet backend
```

---

## 💡 Padomi

### Development

1. **Izmantojiet Dark Mode** - Ērtāks ilgstošai darbam
2. **Saglabājiet Promptus** - Admin panelī saglabājiet labākos promptus
3. **Pievienojiet Vadlīnijas** - Jo vairāk vadlīniju, jo labāki ieteikumi
4. **Testējiet Visas Valodas** - Pārliecinieties, ka viss darbojas

### Production

1. **Environment Variables** - Nekad necommitējiet .env failus
2. **API Keys** - Izmantojiet drošus key management risinājumus
3. **Monitoring** - Iestatiet error tracking (Sentry)
4. **Backups** - Regulāri backup vadlīnijas un promptus

---

## 🎓 Mācību Resursi

### Video Tutorials (Nākotne)
- [ ] Projekta pārskats
- [ ] Pirmā lietošana
- [ ] Vadlīniju pievienošana
- [ ] Prompta optimizācija

### Piemēri
- `sample-guidelines.md` - Vadlīniju piemēri
- `TESTING.md` - Testa teksti visās valodās

### API Dokumentācija
- Skatiet `README.md` API Endpoints sadaļu
- Testējiet ar `curl` vai Postman

---

## 📞 Atbalsts

### Problēmas?

1. **Pārbaudiet dokumentāciju** - Vispirms skatiet attiecīgo .md failu
2. **Console logs** - Skatiet browser console (F12) un backend terminal
3. **GitHub Issues** - Izveidojiet issue ar detalizētu aprakstu
4. **Community** - Jautājiet komandai

### Noderīgi Komandas

```bash
# Skatīt visas pieejamās komandas
npm run

# Pārbaudīt versijas
node --version
npm --version

# Notīrīt un reinstalēt
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all

# Build production
npm run build

# Skatīt build izmēru
du -sh frontend/dist backend/dist
```

---

## 🎉 Gatavs Sākt!

Tagad jums ir viss nepieciešamais, lai sāktu:

1. ✅ Instalēti dependencies
2. ✅ Konfigurēti environment variables
3. ✅ Palaists development server
4. ✅ Zināt kur meklēt palīdzību

**Dodieties uz http://localhost:3000 un sāciet!**

---

## 📊 Projekta Statistika

- **Komponentes**: 10+
- **API Endpoints**: 4
- **Valodas**: 3 (LV, RU, EN)
- **Dokumentācija**: 8 faili
- **Koda Rindas**: 3500+
- **Development Laiks**: ~10.5h

---

## 🚀 Deployment

Kad esat gatavs deploy:

```bash
# Skatiet detalizētas instrukcijas
cat DEPLOYMENT.md

# Quick Vercel deployment
cd frontend && vercel
cd backend && vercel
```

---

**Veiksmi ar projektu! 🎯**

Ja jums patīk projekts, ⭐ star repository GitHub!

