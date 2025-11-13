# 🚨 Netlify 403 Error - Vienkāršots Risinājums

## Problēma
Netlify nevar parse konfigurāciju (403 error) - iespējams account permissions jautājums.

## ✅ Risinājums

### 1. Vienkāršots `netlify.toml`

Noņemtas visas papildu konfigurācijas, atstāts tikai minimums:

```toml
[build]
  command = "cd frontend && npm install && npm run build"
  publish = "frontend/dist"

[build.environment]
  NODE_VERSION = "18"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Commit un Push

```bash
git add netlify.toml NETLIFY_SIMPLE_FIX.md
git commit -m "fix: vienkāršots netlify.toml - noņemti headers un extra redirects"
git push origin main
```

---

## 🔧 Alternatīvs Risinājums - Netlify UI

Ja joprojām ir problēmas, konfigurējiet tieši Netlify dashboard:

### 1. Site Settings → Build & Deploy → Build Settings

```
Base directory: (leave empty)
Build command: cd frontend && npm install && npm run build
Publish directory: frontend/dist
Functions directory: netlify/functions
```

### 2. Site Settings → Environment Variables

```
NODE_VERSION = 18
GEMINI_API_KEY = AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco
```

### 3. Trigger Deploy

Site overview → Trigger deploy → Deploy site

---

## 🎯 Ja 403 Error Turpinās

### Iespējamie Cēloņi:

1. **Account Permissions**
   - Pārbaudiet vai esat logged in: `netlify status`
   - Ja nē: `netlify login`

2. **Site Ownership**
   - Pārbaudiet vai jums ir owner/admin rights uz site
   - Settings → General → Transfer site ownership (ja vajag)

3. **Extensions Error**
   - Netlify mēģina ielādēt extensions bet nevar
   - Risinājums: Ignore extensions vai contact Netlify support

### Quick Workaround:

**Dzēsiet `netlify.toml` un konfigurējiet tikai caur UI:**

```bash
git rm netlify.toml
git commit -m "fix: remove netlify.toml, configure via UI"
git push origin main
```

Tad konfigurējiet visu Netlify dashboard (skat. augstāk).

---

## 📞 Netlify Support

Ja nekas nepalīdz:

1. Dodieties uz: https://www.netlify.com/support/
2. Vai: https://answers.netlify.com/
3. Vai: support@netlify.com

Iekļaujiet:
- Site ID: `d9d1709f-8db0-4c60-bd7c-74db52123391`
- Error: `403 from fetching extensions`
- Build log

---

## ✅ Vienkāršākais Ceļš

**Konfigurējiet visu caur Netlify UI, nevis netlify.toml:**

1. ✅ Dzēsiet netlify.toml
2. ✅ Netlify Dashboard → Build Settings
3. ✅ Iestatiet manuāli:
   - Build: `cd frontend && npm install && npm run build`
   - Publish: `frontend/dist`
   - Functions: `netlify/functions`
4. ✅ Environment Variables
5. ✅ Deploy!

**Tas noteikti darbosies!** 🚀


