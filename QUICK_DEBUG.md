# 🔍 Quick Debug Guide

## Problēma: API Nav Atrodams

### 1. Pārbaudi Netlify Functions
Dodies uz: https://app.netlify.com/sites/phenomenal-macaron-5617d0/functions

Pārbaudi:
- ✅ Vai funkcijas ir deployed? (analyze, summarize, suggestions, health)
- ✅ Vai tās ir aktīvas?
- ✅ Vai ir error logs?

### 2. Testē Health Endpoint
Atver jaunu tab:
```
https://phenomenal-macaron-5617d0.netlify.app/.netlify/functions/health
```

Ja darbojas → redzēsi:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "Viedais Teksta Redaktors API"
}
```

### 3. Pārbaudi Build Log
Netlify Dashboard → Deploys → Latest deploy → Deploy log

Meklē:
```
✔ Functions bundled successfully
```

### 4. Pārbaudi Environment Variables
Netlify Dashboard → Site Settings → Environment Variables

Vajag būt:
```
GEMINI_API_KEY = AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco
NODE_VERSION = 22
```

### 5. Ja Functions Nav Deployed:

#### Option A: Trigger Redeploy
```bash
# Lokāli:
git add .
git commit -m "fix: restore console.log for debugging" --allow-empty
git push origin main
```

#### Option B: Netlify Dashboard
Site Overview → Trigger Deploy → **Clear cache and deploy site**

### 6. Ja Health Endpoint Nedarbojas:

Problēma ir functions build. Pārbaudi:
```bash
cd netlify/functions
npm install
```

Ja kļūdas → share error message

### 7. Real-time Function Logs

Netlify Dashboard → Functions → analyze → **View function logs**

Vai:
```bash
netlify dev
```

### 8. Common Issues:

#### A) Functions direktorija nav pareiza
Check `netlify.toml`:
```toml
[functions]
  directory = "netlify/functions"
```

#### B) Dependencies nav installed
```bash
cd netlify/functions
npm install
cd ../..
git add netlify/functions/package-lock.json
git commit -m "fix: add functions dependencies"
git push
```

#### C) TypeScript compile error
Check functions build log for TS errors

### 9. Manual Test (lokāli):

```bash
# Terminal 1 - Backend
cd netlify/functions
npm install
netlify dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

Tad atver: http://localhost:8888

---

## Ko Darīt TAGAD:

1. ✅ Es noņēmu `drop_console` - tagad console.log atkal darbojas
2. ⏳ Redeploy ar:
   ```bash
   git add .
   git commit -m "fix: restore console logs for debugging"
   git push
   ```
3. ⏳ Netlify Dashboard → Trigger Deploy
4. ⏳ Kad deployed → atver console un skaties error messages
5. ⏳ Share error message man!

---

## Ātrā Diagnostika:

Atver console (F12) un ieraksti:
```javascript
// Test 1: Check API URL
console.log('API URL:', import.meta.env.VITE_API_URL || '/.netlify/functions');

// Test 2: Test health
fetch('/.netlify/functions/health')
  .then(r => r.json())
  .then(d => console.log('Health:', d))
  .catch(e => console.error('Health error:', e));

// Test 3: Test analyze
fetch('/.netlify/functions/analyze', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    text: 'Tests',
    settings: {language: 'lv', category: 'news', targetAudience: 'general'},
    prompt: 'Analizē'
  })
})
  .then(r => r.json())
  .then(d => console.log('Analyze:', d))
  .catch(e => console.error('Analyze error:', e));
```

Share rezultātu!

