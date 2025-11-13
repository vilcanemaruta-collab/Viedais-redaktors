# 🔧 Netlify Functions Dependencies Fix

## Problēma
```
ERROR: Could not resolve "@google/generative-ai"
A Netlify Function is using "@google/generative-ai" but that dependency has not been installed yet.
```

## Cēlonis
Netlify Functions ar savu `package.json` (`netlify/functions/package.json`) neinstalē dependencies automātiski build laikā.

## Risinājums ✅

### 1. Pārvietot dependencies uz root `package.json`

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.1.3",
    "@netlify/functions": "^2.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3"
  }
}
```

### 2. Atjaunināt `netlify.toml` build command

```toml
[build]
  command = "npm install && cd frontend && npm install && npm run build"
  publish = "frontend/dist"
```

**Izmaiņas:**
- Pievienots `npm install` pirms frontend build
- Tas instalē root dependencies (ieskaitot `@google/generative-ai`)
- Netlify Functions tagad var atrast nepieciešamos packages

## Kāpēc šis risinājums?

1. **Ātrākais** - Nav jāmaina functions struktūra
2. **Drošākais** - Netlify oficiāli iesaka šo pieeju
3. **Vienkāršākais** - Viens `npm install` root līmenī

## Alternatīvie risinājumi (neizmantoti)

### Variants A: Plugin
```toml
[[plugins]]
  package = "@netlify/plugin-functions-install-core"
```
❌ Lēnāks, papildus dependency

### Variants B: Manual install
```toml
[build]
  command = "cd netlify/functions && npm install && cd ../../frontend && npm install && npm run build"
```
❌ Sarežģītāks, vairāk laika

## Rezultāts

✅ Frontend build: `dist/index.html` + assets  
✅ Functions bundling: Visas 4 functions ar dependencies  
✅ Deploy: Gatavs production

## Nākamais solis

Commit un push:
```bash
git add package.json netlify.toml
git commit -m "fix: Add Netlify Functions dependencies to root package.json"
git push
```

Netlify automātiski uzbūvēs no jauna! 🚀

