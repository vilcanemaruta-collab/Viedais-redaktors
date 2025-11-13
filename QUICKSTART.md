# Quick Start Guide - Viedais Teksta Redaktors

## Ātrā Palaišana (5 minūtes)

### 1. Instalācija

```bash
# Clone repository (ja izmanto Git)
git clone <repository-url>
cd Viedais-redaktors

# Vai vienkārši atveriet projekta mapi
cd Viedais-redaktors
```

### 2. Frontend Setup

```bash
cd frontend

# Instalēt dependencies
npm install

# Izveidot .env failu
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Palaist development server
npm run dev
```

Frontend tagad darbojas uz: **http://localhost:3000**

### 3. Backend Setup (jaunā terminal logā)

```bash
cd backend

# Instalēt dependencies
npm install

# Izveidot .env failu ar Gemini API key
echo "PORT=5000" > .env
echo "GEMINI_API_KEY=AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco" >> .env
echo "NODE_ENV=development" >> .env
echo "CORS_ORIGIN=http://localhost:3000" >> .env

# Palaist development server
npm run dev
```

Backend tagad darbojas uz: **http://localhost:5000**

### 4. Atvērt pārlūkā

Atveriet **http://localhost:3000** savā pārlūkā.

## Pirmā Lietošana

### Solis 1: Ievadiet Tekstu
1. Atveriet aplikāciju
2. Redzēsiet lielu teksta ievades lauku
3. Ielīmējiet vai ierakstiet tekstu latviešu, krievu vai angļu valodā

### Solis 2: Iestatiet Parametrus
1. Noklikšķiniet uz "Iestatījumi" (Settings ikona kreisajā pusē)
2. Izvēlieties valodu (Latviešu/Krievu/Angļu)
3. Izvēlieties kategoriju (Ziņas/Sports/Kultūra/Bizness/Viedoklis)
4. Izvēlieties stilu (Formāls/Neformāls/Neitrāls)

### Solis 3: Analizējiet
1. Atgriezieties uz "Teksta Ievade"
2. Noklikšķiniet "Analizēt tekstu" vai nospiediet Ctrl+Enter
3. Gaidiet dažas sekundes

### Solis 4: Skatiet Rezultātus
Jūs redzēsiet:
- **Lasāmības rādītāju** (0-100, jo augstāks, jo vieglāk lasāms)
- **Metrīkas**: vārdi, teikumi, rindkopas, vidējais vārdu skaits teikumā
- **Problēmas**: sarežģīti teikumi, stila problēmas ar ieteikumiem
- **Kopsavilkumu**: AI ģenerēts bullet-point kopsavilkums

## Papildu Funkcijas

### Dark Mode
Noklikšķiniet uz Mēness/Saules ikonas kreisajā apakšējā stūrī.

### Administrēšana
1. Noklikšķiniet uz "Administrēšana" (Shield ikona)
2. Pievienojiet vadlīnijas (piemēram, Reuters Style Guide)
3. Pievienojiet labus rakstus zināšanu bāzei
4. Rediģējiet sistēmas promptu pēc vajadzības

### Eksportēšana
Analīzes lapā noklikšķiniet "Eksportēt", lai saglabātu rezultātus JSON formātā.

## Problēmu Risināšana

### Frontend neielādējas
```bash
# Pārbaudiet vai ports 3000 ir brīvs
netstat -ano | findstr :3000

# Ja aizņemts, mainiet portu vite.config.ts
```

### Backend neatbild
```bash
# Pārbaudiet vai ports 5000 ir brīvs
netstat -ano | findstr :5000

# Pārbaudiet vai .env fails eksistē
cat backend/.env

# Pārbaudiet backend logs
cd backend
npm run dev
```

### "Failed to analyze text"
- Pārbaudiet vai backend darbojas
- Pārbaudiet VITE_API_URL frontend .env failā
- Pārbaudiet Gemini API key backend .env failā

### CORS kļūda
Pārbaudiet vai backend .env failā:
```
CORS_ORIGIN=http://localhost:3000
```

## Testa Teksti

### Latviešu (Vienkāršs):
```
Latvijas futbola izlase šodien spēlēja pret Igauniju. Spēle beidzās ar rezultātu 2:1. Latvijas komanda uzvarēja. Treneri bija apmierināti ar rezultātu.
```

### Latviešu (Sarežģīts):
```
Ņemot vērā to, ka ekonomiskā situācija valstī, kas ir atkarīga no daudziem faktoriem, tostarp globālajiem tirgus apstākļiem un iekšpolitiskajiem lēmumiem, ir kļuvusi arvien sarežģītāka, valdība ir spiesta pieņemt papildu pasākumus.
```

### Krievu:
```
Российская команда выиграла матч со счетом три-один. Игра была напряженной и интересной. Болельщики остались довольны результатом.
```

### Angļu:
```
The company announced strong quarterly results. Revenue increased by 25 percent. Investors were pleased with the performance. The stock price rose significantly.
```

## Keyboard Shortcuts

- `Ctrl+Enter` - Sākt analīzi (Teksta Ievade lapā)
- `Esc` - Aizvērt modālos logus

## Nākamie Soļi

1. **Pievienojiet vadlīnijas**: Dodieties uz Administrēšana → Vadlīnijas
2. **Testējiet dažādas valodas**: Izmēģiniet LV, RU, EN
3. **Eksperimentējiet ar iestatījumiem**: Mainiet kategorijas un stilus
4. **Rediģējiet promptu**: Pielāgojiet AI uzvedību savām vajadzībām

## Papildu Resursi

- `README.md` - Pilna dokumentācija
- `TESTING.md` - Testēšanas instrukcijas
- `DEPLOYMENT.md` - Deployment guide
- `v.plan.md` - Detalizēts implementācijas plāns

## Atbalsts

Ja rodas problēmas:
1. Pārbaudiet console (F12 pārlūkā)
2. Pārbaudiet backend logs terminal
3. Skatiet TESTING.md troubleshooting sadaļu

## Produktīvie Padomi

- Saglabājiet labākos promptus Admin → Sistēmas Prompts
- Pievienojiet Reuters un Delfi vadlīnijas
- Izmantojiet Dark Mode ilgstošai darbam
- Eksportējiet rezultātus regulārai analīzei
- Pievienojiet labākos rakstus zināšanu bāzei

Priecīgu kodēšanu! 🚀

