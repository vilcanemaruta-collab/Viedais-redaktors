# Netlify Deployment Guide

## ✅ Gatavība Checklist

Projekts ir **GATAVS** Netlify deployment! Šeit ir viss, kas jums jāzina:

---

## 📋 Kas Ir Gatavs

### ✅ Konfigurācija
- ✅ `netlify.toml` - Galvenā Netlify konfigurācija
- ✅ `netlify/functions/` - Serverless funkcijas (4 endpoints)
- ✅ `frontend/` - React aplikācija ar Vite
- ✅ Environment variables dokumentēti

### ✅ Netlify Functions (Backend)
- ✅ `/analyze` - Teksta analīze
- ✅ `/summarize` - Kopsavilkuma ģenerēšana
- ✅ `/suggestions` - Ieteikumu iegūšana
- ✅ `/health` - Health check

### ✅ Frontend
- ✅ React + TypeScript + Vite
- ✅ TailwindCSS
- ✅ SPA routing ar redirects
- ✅ Environment variables support

---

## 🚀 Deployment Soļi

### 1. Commit un Push uz Git

```bash
git add .
git commit -m "feat: Netlify deployment gatavs"
git push origin main
```

### 2. Netlify Dashboard Setup

1. **Dodieties uz Netlify Dashboard**
   - https://app.netlify.com/

2. **Import from Git**
   - Noklikšķiniet "Add new site" → "Import an existing project"
   - Izvēlieties GitHub
   - Izvēlieties `Viedais-redaktors` repository

3. **Build Settings** (automātiski detektēs no netlify.toml):
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`
   - **Functions directory**: `netlify/functions`

4. **Environment Variables**
   
   Dodieties uz Site settings → Environment variables un pievienojiet:

   ```
   GEMINI_API_KEY = AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco
   NODE_VERSION = 18
   ```

5. **Deploy!**
   - Noklikšķiniet "Deploy site"
   - Gaidiet ~2-3 minūtes

---

## 🔧 Konfigurācija Detaļas

### netlify.toml Highlights

```toml
[build]
  base = "frontend"
  command = "npm install && npm run build"
  publish = "frontend/dist"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### API Endpoints

Pēc deployment, jūsu API būs pieejams:

```
https://your-site-name.netlify.app/.netlify/functions/analyze
https://your-site-name.netlify.app/.netlify/functions/summarize
https://your-site-name.netlify.app/.netlify/functions/suggestions
https://your-site-name.netlify.app/.netlify/functions/health
```

### Frontend API URL

**Production** - Netlify automātiski iestatīs:
```
VITE_API_URL=/.netlify/functions
```

**Development** - Lokāli:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Environment Variables

### Netlify Dashboard

Iestatiet šīs environment variables Netlify dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco` | Google Gemini API key |
| `NODE_VERSION` | `18` | Node.js versija |

### Kā Pievienot

1. Site settings → Environment variables
2. Add a variable
3. Key: `GEMINI_API_KEY`
4. Value: `AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco`
5. Scopes: All (Production, Deploy Previews, Branch deploys)
6. Save

---

## 🎯 Post-Deployment

### 1. Pārbaudiet Deployment

```bash
# Health check
curl https://your-site-name.netlify.app/.netlify/functions/health

# Sagaidāmā atbilde:
{
  "status": "ok",
  "timestamp": "2024-11-13T...",
  "service": "Viedais Teksta Redaktors API"
}
```

### 2. Testējiet Frontend

1. Atveriet `https://your-site-name.netlify.app`
2. Ievadiet tekstu
3. Iestatiet valodu/kategoriju
4. Analizējiet

### 3. Pārbaudiet Logs

Netlify Dashboard → Functions → View logs

---

## 🔄 Automātiskais Deployment

Katrs push uz `main` branch automātiski:
1. Trigger jaunu build
2. Deploy uz production
3. Atjaunina functions

### Branch Deploys

Netlify automātiski izveido preview deploys katram pull request!

---

## 🐛 Troubleshooting

### Problēma: Functions neatbild

**Risinājums:**
1. Pārbaudiet Netlify Functions logs
2. Pārbaudiet vai `GEMINI_API_KEY` ir iestatīts
3. Pārbaudiet vai `netlify/functions/package.json` ir commitots

### Problēma: Frontend nevar savienoties ar API

**Risinājums:**
1. Pārbaudiet vai `VITE_API_URL` ir `/.netlify/functions`
2. Pārbaudiet browser console errors
3. Pārbaudiet Network tab

### Problēma: Build fails

**Risinājums:**
```bash
# Lokāli testējiet build
cd frontend
npm install
npm run build

# Ja darbojas lokāli, bet ne Netlify:
# Pārbaudiet Node versiju
node --version  # Vajag 18+
```

### Problēma: CORS errors

**Risinājums:**
Netlify Functions jau ir konfigurētas ar CORS headers:
```javascript
'Access-Control-Allow-Origin': '*'
```

Ja joprojām ir problēmas, pārbaudiet browser console.

---

## 📊 Performance

### Expected Metrics

- **Build time**: ~2-3 minūtes
- **Function cold start**: ~1-2 sekundes
- **Function warm**: ~200-500ms
- **Frontend load**: <2 sekundes

### Optimization

Netlify automātiski:
- ✅ CDN distribution
- ✅ Gzip compression
- ✅ HTTP/2
- ✅ Asset optimization

---

## 💰 Pricing

### Free Tier Includes:
- ✅ 100GB bandwidth/month
- ✅ 125K function requests/month
- ✅ 100 build minutes/month
- ✅ Unlimited sites

**Jūsu projekts ietilpst Free tier!** 🎉

---

## 🔗 Useful Links

- **Netlify Dashboard**: https://app.netlify.com/
- **Netlify Docs**: https://docs.netlify.com/
- **Functions Docs**: https://docs.netlify.com/functions/overview/
- **Build Settings**: https://docs.netlify.com/configure-builds/overview/

---

## 📝 Custom Domain (Optional)

### Pievienot Custom Domain

1. Site settings → Domain management
2. Add custom domain
3. Sekojiet DNS setup instrukcijām
4. SSL automātiski aktivizēsies

---

## ✅ Final Checklist

Pirms deployment:

- ✅ `netlify.toml` eksistē
- ✅ `netlify/functions/` ar visām funkcijām
- ✅ `frontend/package.json` ar build script
- ✅ Git repository connected
- ✅ Environment variables dokumentēti
- ✅ `.gitignore` konfigurēts

**VISS GATAVS! Varat deploy tagad!** 🚀

---

## 🎉 Success!

Pēc veiksmīga deployment:

1. ✅ Frontend pieejams uz `https://your-site-name.netlify.app`
2. ✅ API functions darbojas
3. ✅ Automātiskais deployment aktīvs
4. ✅ SSL sertifikāts aktīvs
5. ✅ CDN distribution aktīvs

**Apsveicam! Jūsu projekts ir live!** 🎊

---

## 📞 Support

Ja rodas problēmas:
1. Skatiet Netlify build logs
2. Skatiet Function logs
3. Pārbaudiet browser console
4. Skatiet šo dokumentāciju

**Veiksmi ar deployment!** 🚀

