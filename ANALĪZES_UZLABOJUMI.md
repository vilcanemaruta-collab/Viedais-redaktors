# Analīzes Algoritma Uzlabojumi 🚀

## Īstenoti Uzlabojumi

### 1. Paplašināti Teksta Metriki

Tagad `TextMetrics` iekļauj papildu parametrus:

```typescript
interface TextMetrics {
  // Pamata metriki
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  readabilityScore: number;
  complexSentences: number;
  
  // JAUNIE METRIKI
  passiveVoiceCount?: number;           // Pasīvās balss teikumu skaits
  passiveVoicePercentage?: number;      // Pasīvās balss %
  longSentencesCount?: number;          // Garo teikumu skaits (>25 vārdi)
  longSentencesPercentage?: number;     // Garo teikumu %
  avgParagraphLength?: number;          // Vidējais teikumu skaits rindkopā
  wordRepetitionScore?: number;         // Vārdu daudzveidības rādītājs (0-100)
  guidelineCompliance?: {               // Atbilstība vadlīnijām
    sentenceLength: 'excellent' | 'good' | 'fair' | 'poor';
    activeVoice: 'excellent' | 'good' | 'fair' | 'poor';
    clarity: 'excellent' | 'good' | 'fair' | 'poor';
    overall: number;
  };
}
```

### 2. Uzlabota Pasīvās Balss Detekcija

**Pirms:**
- Vienkārši regex meklējumi

**Tagad:**
- Paplašināti regex paterni visām valodām
- Latviešu: `tiek`, `tika`, `tiks`, `top` konstrukcijas
- Krievu: refleksīvie darbības vārdi ar `-ся/-сь`
- Angļu: pilnīgāka `to be + past participle` detekcija

### 3. Jauna Funkcionalitāte

#### `findLongSentences()`
Atrod teikumus, kas pārsniedz 25 vārdus (pēc vadlīnijām):

```typescript
const longSentences = findLongSentences(text, 'lv');
// Atgriež teikumus, kas pārsniedz robežu
```

#### `calculateWordRepetitionScore()`
Novērtē vārdu daudzveidību (100 = maksimāla daudzveidība):

```typescript
const score = calculateWordRepetitionScore(text);
// 85+ = labi, 70-84 = vidēji, <70 = uzlabot
```

#### `assessGuidelineCompliance()`
Vērtē atbilstību vadlīnijām pēc 3 kritērijiem:

1. **Teikumu garums:**
   - Excellent: 15-20 vārdi (ideāls)
   - Good: 12-25 vārdi
   - Fair: 10-30 vārdi
   - Poor: < 10 vai > 30 vārdi

2. **Aktīvā balss:**
   - Excellent: ≤ 5% pasīvā
   - Good: ≤ 15% pasīvā
   - Fair: ≤ 30% pasīvā
   - Poor: > 30% pasīvā

3. **Skaidrība:**
   - Balstīts uz lasāmības rādītāju (readability score)

#### `detectVagueWords()`
Identificē neskaidrus/vājus vārdus, kas jāizvairās:

**Latviešu:** daudz, daži, vairāki, iespējams, šķiet, lieta, process
**Krievu:** много, возможно, вероятно, вещь, процесс
**Angļu:** very, really, quite, thing, stuff, probably

### 4. Uzlabots Prompt Builder

**Galvenās izmaiņas:**

1. **Strukturētāks prompts:**
   - Skaidri sadaļas ar vizuāliem atdalītājiem
   - Konkrēti analīzes uzdevumi

2. **Iekļauti labo piemēru izraksti:**
   ```typescript
   // Tagad zināšanu bāzes raksti tiek iekļauti ar saturu (300 chars)
   const knowledgeBaseText = relevantArticles
     .map(a => `### ${a.title}\n${excerpt}`)
     .join('\n\n');
   ```

3. **6 konkrēti analīzes uzdevumi:**
   - Teikumu garums (15-20 vārdi)
   - Aktīvā/pasīvā balss
   - Skaidrība un konkrētība
   - Rindkopu struktūra (3-4 teikumi)
   - Vārdu daudzveidība
   - Atbilstība labajiem piemēriem

4. **Detalizētāks kopsavilkums:**
   - Galvenie atrādījumi
   - Stiprās puses
   - Uzlabojumu jomas
   - Rekomendācijas atbilstoši vadlīnijām

## Kā Sistēma Tagad Darbojas

### Analīzes Plūsma

```
1. Lokālā Analīze (analysisMetrics.ts)
   ├─ Pamata metriki (vārdi, teikumi, rindkopas)
   ├─ Lasāmības rādītājs (Flesch)
   ├─ Pasīvās balss detekcija
   ├─ Garo teikumu skaits
   ├─ Vārdu atkārtošanās
   └─ Atbilstība vadlīnijām (3 kategorijas)

2. Prompt Izveide (promptBuilder.ts)
   ├─ Iekļauj vadlīnijas (prioritātes secībā)
   ├─ Pievieno labos piemērus ar saturu
   ├─ Strukturē 6 analīzes uzdevumus
   └─ Definē izvades formātu

3. AI Analīze (Gemini 2.0 Flash)
   ├─ Detalizēta problēmu identificēšana
   ├─ Konkrēti uzlabojuma ieteikumi
   ├─ Salīdzinājums ar labajiem piemēriem
   └─ Bullet point kopsavilkums

4. Rezultātu Apvienošana
   ├─ Lokālie + AI metriki
   ├─ Vienots lasāmības rādītājs
   └─ Pilnīga analīze lietotājam
```

## Rekomendācijas Turpmākai Lietošanai

### 1. Pievienojiet Kvalitatīvas Vadlīnijas

Dodieties uz **Administrēšana → Vadlīnijas** un pievienojiet:

- **Prioritāte 10:** Galvenais stila ceļvedis (Reuters, AP Style)
- **Prioritāte 9:** Redakcijas iekšējās vadlīnijas
- **Prioritāte 5:** Valodas specifiskās vadlīnijas
- **Prioritāte 1:** Papildu ieteikumi

Piemērs no `sample-guidelines.md`:
```markdown
## Teikumu Garums
- Ideālais teikuma garums: 15-20 vārdi
- Maksimālais ieteicamais garums: 25 vārdi
- Gari teikumi (>30 vārdi) jāsadala

## Aktīvā Balss
- Izmantojiet aktīvo balsi, ne pasīvo
- Piemērs: "Valdība pieņēma lēmumu" (labs)
- Nevis: "Lēmums tika pieņemts" (slikts)
```

### 2. Izveidojiet Zināšanu Bāzi

**Administrēšana → Zināšanu Bāze:**

- Pievienojiet labākos rakstus katrai kategorijai
- AI salīdzinās analizējamo tekstu ar šiem piemēriem
- Izmantojiet 300+ vārdu garus rakstus

**Tips:** Izvēlieties rakstus, kas:
- Atbilst visām vadlīnijām
- Ir konkrēti un skaidri
- Izmanto aktīvo balsi
- Satur īsus teikumus (15-20 vārdi)

### 3. Optimizējiet Sistēmas Promptu

**Administrēšana → Sistēmas Prompts:**

Pielāgojiet prompt template, ja nepieciešams:
- Mainiet analīzes uzdevumu prioritāti
- Pievienojiet specifiskus kritērijus jūsu nozarei
- Definējiet papildu metrikus

### 4. Interpretējiet Rezultātus

#### Atbilstības Rādītāji

**Teikumu garums:**
- 🟢 Excellent: Perfekti 15-20 vārdi
- 🟡 Good: Pieļaujami 12-25
- 🟠 Fair: Robežgadījumi 10-30
- 🔴 Poor: Pārāk īsi vai gari

**Aktīvā balss:**
- 🟢 Excellent: ≤5% pasīvā (izcili!)
- 🟡 Good: ≤15% pasīvā (labi)
- 🟠 Fair: ≤30% pasīvā (uzlabot)
- 🔴 Poor: >30% pasīvā (slikti)

**Skaidrība:**
- Balstīts uz Flesch lasāmības rādītāju
- 70+ = Excellent (viegli lasāms)
- 60-69 = Good (vidēji)
- 50-59 = Fair (sarežģīti)
- <50 = Poor (ļoti grūti)

#### Vārdu Daudzveidība

- **85-100:** Izcila vārdu izvēle, laba sinonīmu lietošana
- **70-84:** Labi, bet var uzlabot
- **50-69:** Daudz atkārtojumu, nepieciešami sinonīmi
- **<50:** Trūkst vārdu krājuma

### 5. Izmantojiet Analīzes Rezultātus

#### A. Pasīvās Balss Problēmas

Ja pasīvā balss >15%:
1. Meklējiet teikumus ar `tiek`, `tika`, `tiks`
2. Pārrakstiet aktīvajā balsī
3. Piemērs: 
   - ❌ "Lēmums tika pieņemts" 
   - ✅ "Ministri pieņēma lēmumu"

#### B. Gari Teikumi

Ja >25 vārdi:
1. Sadaliet vienā teikumā 2-3 teikumos
2. Izmantojiet punktu, nevis komatu
3. Viena doma = viens teikums

#### C. Vārdu Atkārtošanās

Ja rādītājs <70:
1. Izmantojiet sinonīmus
2. Pārfrāzējiet
3. Lietojiet zaimvārdus (tas, šis, viņš)

### 6. Regulāra Optimizācija

**Iknedēļas:**
- Pārskatiet populārākās problēmas
- Atjauniniet vadlīnijas
- Pievienojiet jaunus labos piemērus

**Ikmēneša:**
- Analizējiet kopējos rādītājus
- Trenējiet redaktorus
- Pielāgojiet sistēmas promptu

## Tehniskās Detaļas

### Atbilstības Aprēķins

```typescript
overall_score = 
  sentenceLengthScore × 0.3 +
  activeVoiceScore × 0.3 +
  readabilityScore × 0.4

// Piemērs:
// Sentence: 80/100 (good)
// Active: 100/100 (excellent)  
// Readability: 75/100 (excellent)
// Overall = 80×0.3 + 100×0.3 + 75×0.4 = 84/100
```

### Pasīvās Balss %

```typescript
passivePercentage = (passiveSentences / totalSentences) × 100

// Piemērs:
// 2 pasīvie no 20 teikumiem = 10% (Good)
```

### Vārdu Daudzveidība

```typescript
repetitionScore = (uniqueWords / totalWords) × 100

// Piemērs:
// 85 unikāli no 100 vārdiem = 85% (Excellent)
```

## Nākamie Soļi

1. **Testējiet ar reāliem tekstiem:**
   - Analizējiet dažādus rakstus
   - Pārbaudiet, vai ieteikumi ir noderīgi
   - Pielāgojiet vadlīnijas

2. **Apkopojiet labākās prakses:**
   - Izveidojiet piemēru bibliotēku
   - Dokumentējiet tipiskās problēmas
   - Izstrādājiet risinājumus

3. **Apmāciet lietotājus:**
   - Parādiet, kā interpretēt rezultātus
   - Skaidrojiet metriku nozīmi
   - Demonstrējiet uzlabojumu procesu

4. **Monitorējiet kvalitāti:**
   - Sekojiet vidējiem rādītājiem
   - Identificējiet tendences
   - Optimizējiet sistēmu

---

**Izveidots:** 2025-11-13  
**Versija:** 2.0  
**AI Engine:** Gemini 2.0 Flash (pārliecinies par jaunākajiem update)

