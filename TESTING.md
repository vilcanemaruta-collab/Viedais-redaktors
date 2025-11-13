# Testing Dokumentācija

## Testēšanas Stratēģija

### 1. Manuālā Testēšana

#### Latviešu Valoda (LV)

**Testa Teksts 1 - Ziņu Raksts:**
```
Latvijas Republikas Saeima šodien pieņēma jaunu likumu par vides aizsardzību. Likumprojekts paredz stingrākus noteikumus uzņēmumiem, kas rada piesārņojumu. Vides aizsardzības un reģionālās attīstības ministrija uzskata, ka šie pasākumi palīdzēs uzlabot gaisa kvalitāti pilsētās. Likums stāsies spēkā nākamā gada sākumā.
```

**Sagaidāmie Rezultāti:**
- Lasāmības rādītājs: 60-80 (samērā viegli)
- Vārdu skaits: ~40
- Teikumu skaits: 4
- Vidēji vārdi/teikums: ~10
- Nav sarežģītu teikumu

**Testa Teksts 2 - Sarežģīts Teksts:**
```
Ņemot vērā to, ka Eiropas Savienības Padome, kas ir viena no galvenajām lēmumu pieņemšanas institūcijām, ir pieņēmusi jaunu regulu, kura paredz, ka dalībvalstīm būs jāievieš papildu pasākumi, lai nodrošinātu, ka visi uzņēmumi, kas darbojas finanšu sektorā un kas ir reģistrēti to jurisdikcijā, ievēro stingrākus kapitāla pietiekamības noteikumus, kuri ir izstrādāti, lai novērstu iespējamos riskus, kas varētu rasties globālās ekonomiskās nestabilitātes apstākļos.
```

**Sagaidāmie Rezultāti:**
- Lasāmības rādītājs: 20-40 (ļoti grūti)
- Vārdu skaits: ~60
- Teikumu skaits: 1
- Vidēji vārdi/teikums: ~60
- Sarežģīti teikumi: 1
- Ieteikumi: sadalīt garajā teikumā

#### Krievu Valoda (RU)

**Testa Teksts - Sporta Ziņas:**
```
Российская сборная по футболу одержала уверенную победу в товарищеском матче. Игра проходила на домашнем стадионе перед многотысячной аудиторией болельщиков. Главный тренер команды выразил удовлетворение результатом и отметил хорошую игру всех футболистов. Следующий матч состоится через две недели.
```

**Sagaidāmie Rezultāti:**
- Lasāmības rādītājs: 65-85
- Vārdu skaits: ~35
- Teikumu skaits: 4
- Pareiza kirilicas rakstzīmju apstrāde

#### Angļu Valoda (EN)

**Testa Teksts - Business:**
```
The company announced record profits for the third quarter. Revenue increased by 25% compared to the same period last year. The CEO attributed this success to strong product demand and efficient cost management. Investors responded positively, with stock prices rising 10% after the announcement.
```

**Sagaidāmie Rezultāti:**
- Lasāmības rādītājs: 60-80
- Vārdu skaits: ~40
- Teikumu skaits: 4
- Standarta Flesch Reading Ease formula

### 2. Funkcionalitātes Testēšana

#### Teksta Ievade
- [ ] Teksts tiek saglabāts real-time
- [ ] Statistika atjaunojas automātiski
- [ ] Ctrl+Enter sāk analīzi
- [ ] Notīrīt poga dzēš visu tekstu
- [ ] Auto-save darbojas (pārlādēt lapu)

#### Iestatījumi
- [ ] Valodas maiņa saglabājas
- [ ] Kategorijas maiņa saglabājas
- [ ] Stila maiņa saglabājas
- [ ] Atiestatīšana atgriež defaults
- [ ] Iestatījumi saglabājas localStorage

#### Analīze
- [ ] Loading state parādās analīzes laikā
- [ ] Metrīkas aprēķinātas pareizi
- [ ] Lasāmības rādītājs 0-100 diapazonā
- [ ] Issues sakārtoti pēc severity
- [ ] Kopsavilkums ģenerēts
- [ ] Eksportēšana darbojas

#### Administrēšana
- [ ] Vadlīniju pievienošana darbojas
- [ ] Failu augšupielāde darbojas
- [ ] Zināšanu bāzes pievienošana darbojas
- [ ] Prompta rediģēšana darbojas
- [ ] Versiju vēsture saglabājas
- [ ] Dzēšana darbojas

#### UI/UX
- [ ] Dark mode toggle darbojas
- [ ] Responsive uz mobile (< 768px)
- [ ] Responsive uz tablet (768-1024px)
- [ ] Responsive uz desktop (> 1024px)
- [ ] Toast notifications parādās
- [ ] Animācijas smooth
- [ ] Nav layout shift

### 3. API Testēšana

#### POST /api/analyze

**Request:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Šis ir testa teksts analīzei.",
    "settings": {
      "language": "lv",
      "category": "news",
      "style": "neutral"
    },
    "prompt": "Analizē šo tekstu..."
  }'
```

**Sagaidāmā Response:**
```json
{
  "readability_score": 75,
  "issues": [],
  "summary": "Kopsavilkums...",
  "metrics": {
    "wordCount": 5,
    "sentenceCount": 1,
    "paragraphCount": 1,
    "avgWordsPerSentence": 5,
    "readabilityScore": 75,
    "complexSentences": 0
  }
}
```

#### Error Handling

**Test 1: Tukšs teksts**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "", "settings": {...}, "prompt": "..."}'
```
Sagaidāms: 400 Bad Request

**Test 2: Pārāk garš teksts (>50000 chars)**
Sagaidāms: 400 Bad Request

**Test 3: Nepareiza valoda**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "test", "settings": {"language": "de"}, "prompt": "..."}'
```
Sagaidāms: 400 Bad Request

#### Rate Limiting

**Test: Vairāk nekā 20 requests minūtē**
```bash
for i in {1..25}; do
  curl -X POST http://localhost:5000/api/analyze \
    -H "Content-Type: application/json" \
    -d '{"text": "test", "settings": {...}, "prompt": "..."}'
done
```
Sagaidāms: 429 Too Many Requests pēc 20. request

### 4. Performance Testēšana

#### Load Time
- [ ] Frontend ielādējas < 3s
- [ ] API atbild < 5s (īsam tekstam)
- [ ] API atbild < 15s (garam tekstam)

#### Memory Usage
- [ ] Frontend < 100MB RAM
- [ ] Backend < 200MB RAM
- [ ] Nav memory leaks (ilgstoša lietošana)

#### Bundle Size
```bash
cd frontend
npm run build
# Pārbaudīt dist/ izmēru
```
Target: < 1MB gzipped

### 5. Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 6. Accessibility

- [ ] Keyboard navigation darbojas
- [ ] Focus indicators redzami
- [ ] Color contrast atbilst WCAG AA
- [ ] Screen reader friendly (aria labels)

### 7. Security Testing

- [ ] XSS protection (ievadīt `<script>alert('xss')</script>`)
- [ ] SQL injection (N/A - nav database)
- [ ] API key nav exposed frontend
- [ ] CORS ierobežots
- [ ] Rate limiting darbojas

## Automated Testing (Future)

### Unit Tests (Vitest)

```bash
cd frontend
npm install -D vitest @testing-library/react
```

**Piemērs: textProcessing.test.ts**
```typescript
import { describe, it, expect } from 'vitest';
import { countWords, splitIntoSentences } from './textProcessing';

describe('textProcessing', () => {
  it('should count words correctly', () => {
    expect(countWords('Hello world')).toBe(2);
    expect(countWords('  Multiple   spaces  ')).toBe(2);
  });

  it('should split sentences correctly', () => {
    const text = 'First sentence. Second sentence!';
    expect(splitIntoSentences(text, 'en')).toHaveLength(2);
  });
});
```

### Integration Tests (Playwright)

```bash
npm install -D @playwright/test
```

**Piemērs: e2e.spec.ts**
```typescript
import { test, expect } from '@playwright/test';

test('full analysis flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Enter text
  await page.fill('textarea', 'Test text for analysis');
  
  // Navigate to settings
  await page.click('text=Iestatījumi');
  await page.click('text=Latviešu');
  
  // Start analysis
  await page.click('text=Analizēt');
  
  // Check results
  await expect(page.locator('text=Analīzes Rezultāti')).toBeVisible();
});
```

## Bug Reporting Template

```markdown
**Apraksts:**
[Īss problēmas apraksts]

**Soļi reproducēšanai:**
1. [Pirmais solis]
2. [Otrais solis]
3. [Trešais solis]

**Sagaidāmā uzvedība:**
[Ko vajadzēja notikt]

**Faktiskā uzvedība:**
[Kas notika]

**Vide:**
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari + versija]
- Frontend versija: [commit hash]
- Backend versija: [commit hash]

**Screenshots:**
[Pievienot, ja iespējams]

**Console errors:**
[Browser console vai backend logs]
```

## Test Coverage Goals

- Unit tests: 80%+
- Integration tests: kritiskās flows
- E2E tests: galvenās user journeys
- Manual testing: visas funkcijas pirms release


