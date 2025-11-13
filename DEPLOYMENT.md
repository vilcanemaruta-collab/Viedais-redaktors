# Deployment Instrukcijas

## Vercel Deployment

### Priekšnosacījumi
1. Vercel konts (https://vercel.com)
2. Vercel CLI instalēts: `npm i -g vercel`
3. Git repository (GitHub, GitLab, vai Bitbucket)

### Frontend Deployment

1. **Sagatavot projektu**
```bash
cd frontend
npm install
npm run build  # Pārbaudīt, vai build darbojas
```

2. **Deploy uz Vercel**
```bash
vercel
```

3. **Konfigurēt Environment Variables Vercel dashboard:**
   - `VITE_API_URL` = jūsu backend URL (piemēram: `https://your-backend.vercel.app/api`)

4. **Production deployment:**
```bash
vercel --prod
```

### Backend Deployment

1. **Sagatavot projektu**
```bash
cd backend
npm install
npm run build  # Pārbaudīt, vai build darbojas
```

2. **Deploy uz Vercel**
```bash
vercel
```

3. **Konfigurēt Environment Variables Vercel dashboard:**
   - `GEMINI_API_KEY` = `AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco`
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = jūsu frontend URL (piemēram: `https://your-app.vercel.app`)
   - `PORT` = `5000` (optional)

4. **Production deployment:**
```bash
vercel --prod
```

### Automātisks Deployment ar Git

1. **Savienot ar Git repository:**
   - Vercel dashboard → Import Project
   - Izvēlēties Git provider
   - Izvēlēties repository

2. **Konfigurēt Build Settings:**

**Frontend:**
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Backend:**
- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

3. **Pievienot Environment Variables** (skat. augstāk)

4. **Deploy:**
   - Katrs push uz `main` branch automātiski deployos

## Alternatīvi Deployment Risinājumi

### Netlify (Frontend)

```bash
cd frontend
npm install
npm run build
netlify deploy --prod --dir=dist
```

### Railway (Backend)

1. Izveidot Railway projektu
2. Savienot ar Git repository
3. Pievienot environment variables
4. Railway automātiski detektēs Node.js un deployos

### Docker

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:5000/api
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - GEMINI_API_KEY=AIzaSyAWVqDIunVa4DjKftnQ1JVBMCAlMrOgCco
      - NODE_ENV=production
      - CORS_ORIGIN=http://localhost:3000
```

## Post-Deployment Checklist

- [ ] Frontend pieejams un ielādējas
- [ ] Backend API atbild uz health check (`/api/health`)
- [ ] CORS konfigurēts pareizi
- [ ] Environment variables iestatītas
- [ ] Gemini API key darbojas
- [ ] Teksta analīze darbojas visās 3 valodās
- [ ] Dark mode darbojas
- [ ] Toast notifications darbojas
- [ ] LocalStorage saglabā datus
- [ ] Responsive design darbojas uz mobilajām ierīcēm

## Troubleshooting

### Frontend nevar savienoties ar Backend
- Pārbaudīt `VITE_API_URL` environment variable
- Pārbaudīt CORS iestatījumus backend
- Pārbaudīt vai backend URL ir pareizs

### Gemini API neatbild
- Pārbaudīt vai `GEMINI_API_KEY` ir pareizi iestatīts
- Pārbaudīt API key limitus
- Skatīt backend logs Vercel dashboard

### Build kļūdas
- Pārbaudīt Node.js versiju (vajag 18+)
- Izdzēst `node_modules` un reinstalēt: `rm -rf node_modules && npm install`
- Pārbaudīt TypeScript kļūdas: `npm run build`

## Monitoring

### Vercel Analytics
- Automātiski pieejams Vercel dashboard
- Skatīt request counts, errors, latency

### Error Tracking
Ieteicams pievienot:
- Sentry (https://sentry.io)
- LogRocket (https://logrocket.com)

## Performance Optimization

### Frontend
- Vite automātiski optimizē bundle
- Code splitting jau implementēts
- Lazy loading komponentēm

### Backend
- Rate limiting implementēts
- Response caching ieteicams pievienot
- CDN izmantošana static assets

## Security

- [ ] API keys nav commitoti Git
- [ ] CORS ierobežots uz konkrētu domain
- [ ] Rate limiting aktīvs
- [ ] HTTPS izmantots production
- [ ] Environment variables drošībā

## Backup

- LocalStorage dati glabājas lietotāja pārlūkā
- Eksportēt analīzes rezultātus JSON formātā
- Git repository kā code backup

