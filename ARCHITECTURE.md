# Arhitektūras Dokumentācija

## 🏗️ Sistēmas Arhitektūra

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 3000)                │  │
│  │                                                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │
│  │  │ TextInput│  │ Settings │  │ Analysis │            │  │
│  │  └──────────┘  └──────────┘  └──────────┘            │  │
│  │  ┌──────────┐                                         │  │
│  │  │  Admin   │                                         │  │
│  │  └──────────┘                                         │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         State Management (Zustand)              │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │  │  │
│  │  │  │Settings  │ │  Text    │ │  Admin   │        │  │  │
│  │  │  │  Store   │ │  Store   │ │  Store   │        │  │  │
│  │  │  └──────────┘ └──────────┘ └──────────┘        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         localStorage                             │  │  │
│  │  │  • Drafts  • Settings  • Guidelines  • Prompts  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Backend (Port 5000)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   API Routes                           │  │
│  │  POST /api/analyze                                     │  │
│  │  POST /api/summarize                                   │  │
│  │  POST /api/suggestions                                 │  │
│  │  GET  /api/health                                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ▼                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Middleware Layer                          │  │
│  │  • CORS  • Validation  • Rate Limiting  • Logging     │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ▼                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Gemini Service                            │  │
│  │  • Prompt Building  • API Calls  • Error Handling     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Google Gemini 2.5 Pro API                       │
│  • Text Analysis  • Summarization  • Suggestions            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Projekta Struktūra

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/           # Reusable UI Components
│   │   ├── Layout.tsx       # Main layout with navigation
│   │   ├── Toast.tsx        # Toast notification component
│   │   └── ToastContainer.tsx # Toast provider & manager
│   │
│   ├── pages/               # Page Components (Routes)
│   │   ├── TextInput.tsx   # Text input page
│   │   ├── Settings.tsx    # Settings configuration
│   │   ├── Analysis.tsx    # Analysis results display
│   │   └── Admin.tsx       # Admin panel
│   │
│   ├── stores/             # State Management (Zustand)
│   │   ├── settingsStore.ts # Language, category, style
│   │   ├── textStore.ts     # Text & analysis results
│   │   └── adminStore.ts    # Guidelines, KB, prompts
│   │
│   ├── services/           # External Services
│   │   └── api.ts          # Backend API integration
│   │
│   ├── utils/              # Utility Functions
│   │   ├── textProcessing.ts    # Text parsing & counting
│   │   ├── analysisMetrics.ts   # Readability calculations
│   │   └── promptBuilder.ts     # Dynamic prompt generation
│   │
│   ├── types/              # TypeScript Definitions
│   │   └── index.ts        # All type definitions
│   │
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
│
├── public/                 # Static assets
├── index.html             # HTML entry point
└── vite.config.ts         # Vite configuration
```

### Backend Architecture

```
backend/
├── src/
│   ├── routes/            # API Route Handlers
│   │   └── analysis.ts   # All analysis endpoints
│   │
│   ├── services/          # Business Logic
│   │   └── geminiService.ts # Gemini AI integration
│   │
│   ├── middleware/        # Express Middleware
│   │   └── validation.ts # Request validation
│   │
│   ├── utils/            # Utility Functions
│   │   └── rateLimit.ts  # Rate limiting logic
│   │
│   └── index.ts          # Express server entry
│
└── package.json          # Dependencies & scripts
```

---

## 🔄 Data Flow

### Text Analysis Flow

```
1. User Input
   ↓
2. TextInput Component
   ↓ (setText)
3. Text Store (Zustand)
   ↓ (localStorage auto-save)
4. localStorage
   
When user clicks "Analyze":
   ↓
5. Navigate to Analysis Page
   ↓
6. Build Analysis Prompt
   ├─ Get active prompt template
   ├─ Get guidelines from Admin Store
   ├─ Get knowledge base articles
   └─ Replace placeholders
   ↓
7. API Call (POST /api/analyze)
   ├─ text
   ├─ settings (language, category, style)
   └─ prompt
   ↓
8. Backend Validation
   ↓
9. Gemini Service
   ├─ Send prompt to Gemini API
   ├─ Retry logic (3 attempts)
   └─ Parse JSON response
   ↓
10. Local Metrics Calculation
    ├─ Word count
    ├─ Sentence count
    ├─ Readability score
    └─ Complex sentences
    ↓
11. Merge AI + Local Results
    ↓
12. Return to Frontend
    ↓
13. Update Text Store
    ↓
14. Render Analysis Page
    ├─ Readability gauge
    ├─ Metrics grid
    ├─ Issues list
    └─ Summary
```

### Settings Flow

```
1. User selects language/category/style
   ↓
2. Settings Component
   ↓ (setLanguage/setCategory/setStyle)
3. Settings Store (Zustand)
   ↓ (persist middleware)
4. localStorage
   ↓
5. Available for next analysis
```

### Admin Flow

```
1. Admin adds guideline/article/prompt
   ↓
2. Admin Component
   ↓ (addGuideline/addArticle/addSystemPrompt)
3. Admin Store (Zustand)
   ↓ (persist middleware)
4. localStorage
   ↓
5. Used in prompt building
```

---

## 🧩 Component Hierarchy

```
App
├── ToastProvider
│   └── Router
│       └── Layout
│           ├── Sidebar
│           │   ├── Navigation
│           │   │   ├── TextInput Link
│           │   │   ├── Settings Link
│           │   │   ├── Analysis Link
│           │   │   └── Admin Link
│           │   └── Dark Mode Toggle
│           │
│           └── Main Content
│               ├── Route: /
│               │   └── TextInput Page
│               │       ├── Textarea
│               │       ├── Statistics Bar
│               │       └── Action Buttons
│               │
│               ├── Route: /settings
│               │   └── Settings Page
│               │       ├── Language Selection
│               │       ├── Category Selection
│               │       ├── Style Selection
│               │       └── Current Settings Summary
│               │
│               ├── Route: /analysis
│               │   └── Analysis Page
│               │       ├── Loading State
│               │       ├── Readability Score
│               │       ├── Metrics Grid
│               │       ├── Issues List
│               │       ├── Summary
│               │       └── Export Button
│               │
│               └── Route: /admin
│                   └── Admin Page
│                       ├── Tab: Knowledge Base
│                       │   ├── Add Article Form
│                       │   └── Articles List
│                       ├── Tab: Guidelines
│                       │   ├── Add Guideline Form
│                       │   └── Guidelines List
│                       └── Tab: System Prompt
│                           ├── Prompt Editor
│                           ├── Preview
│                           └── Version History
```

---

## 🔐 Security Architecture

### Frontend Security

```
┌─────────────────────────────────────────┐
│         Frontend Security               │
├─────────────────────────────────────────┤
│ • No API keys exposed                   │
│ • Input sanitization                    │
│ • XSS protection (React default)        │
│ • localStorage encryption (optional)    │
│ • HTTPS only in production             │
└─────────────────────────────────────────┘
```

### Backend Security

```
┌─────────────────────────────────────────┐
│         Backend Security                │
├─────────────────────────────────────────┤
│ • API key in environment variables      │
│ • CORS restrictions                     │
│ • Rate limiting (20 req/min)           │
│ • Input validation                      │
│ • Error message sanitization           │
│ • Request size limits (10MB)           │
└─────────────────────────────────────────┘
```

---

## 📊 State Management

### Zustand Stores

```
┌─────────────────────────────────────────────────────────┐
│                    Settings Store                        │
├─────────────────────────────────────────────────────────┤
│ State:                                                   │
│  • language: 'lv' | 'ru' | 'en'                         │
│  • category: 'news' | 'sports' | ...                    │
│  • style: 'formal' | 'informal' | 'neutral'             │
│                                                          │
│ Actions:                                                 │
│  • setLanguage(language)                                │
│  • setCategory(category)                                │
│  • setStyle(style)                                      │
│  • reset()                                              │
│                                                          │
│ Persistence: localStorage                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      Text Store                          │
├─────────────────────────────────────────────────────────┤
│ State:                                                   │
│  • text: string                                         │
│  • analysisResult: AnalysisResult | null               │
│  • isAnalyzing: boolean                                │
│                                                          │
│ Actions:                                                 │
│  • setText(text)                                        │
│  • setAnalysisResult(result)                           │
│  • setIsAnalyzing(boolean)                             │
│  • clearText()                                          │
│                                                          │
│ Persistence: text only (localStorage)                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      Admin Store                         │
├─────────────────────────────────────────────────────────┤
│ State:                                                   │
│  • guidelines: Guideline[]                              │
│  • knowledgeBase: KnowledgeBaseArticle[]               │
│  • systemPrompts: SystemPrompt[]                        │
│  • activePromptId: string | null                        │
│                                                          │
│ Actions:                                                 │
│  • addGuideline(guideline)                             │
│  • updateGuideline(id, updates)                        │
│  • deleteGuideline(id)                                 │
│  • addArticle(article)                                 │
│  • deleteArticle(id)                                   │
│  • addSystemPrompt(prompt)                             │
│  • setActivePrompt(id)                                 │
│  • getActivePrompt()                                   │
│                                                          │
│ Persistence: localStorage (all)                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 API Architecture

### Endpoints

```
POST /api/analyze
├─ Input:
│  ├─ text: string (max 50000 chars)
│  ├─ settings: { language, category, style }
│  └─ prompt: string
├─ Processing:
│  ├─ Validation
│  ├─ Gemini API call
│  └─ Response parsing
└─ Output:
   ├─ readability_score: number (0-100)
   ├─ issues: Issue[]
   ├─ summary: string
   └─ metrics: Metrics

POST /api/summarize
├─ Input:
│  ├─ text: string
│  └─ language: string
└─ Output:
   └─ summary: string

POST /api/suggestions
├─ Input:
│  ├─ text: string
│  └─ language: string
└─ Output:
   └─ suggestions: string[]

GET /api/health
└─ Output:
   ├─ status: 'ok'
   └─ timestamp: string
```

---

## 🎨 UI/UX Architecture

### Theme System

```
┌─────────────────────────────────────────┐
│          TailwindCSS Theme              │
├─────────────────────────────────────────┤
│ Colors:                                  │
│  • primary: Blue shades (50-900)        │
│  • gray: Gray shades (50-900)           │
│  • semantic: green, yellow, red, blue   │
│                                          │
│ Dark Mode:                               │
│  • Managed by 'dark' class on <html>   │
│  • Toggle in Layout component           │
│  • Persisted in localStorage            │
│                                          │
│ Components:                              │
│  • btn-primary                          │
│  • btn-secondary                        │
│  • input-field                          │
│  • card                                 │
│                                          │
│ Animations:                              │
│  • slide-in-right (toasts)             │
│  • transitions (all interactive)        │
└─────────────────────────────────────────┘
```

### Responsive Breakpoints

```
Mobile:    < 768px   (1 column, stacked)
Tablet:    768-1024px (2 columns, adapted)
Desktop:   > 1024px  (full layout, sidebar)
```

---

## 🚀 Performance Architecture

### Optimization Strategies

```
┌─────────────────────────────────────────┐
│         Performance Optimizations        │
├─────────────────────────────────────────┤
│ Frontend:                                │
│  • Vite build optimization              │
│  • Code splitting (React.lazy ready)    │
│  • localStorage caching                 │
│  • Debounce ready (auto-save)          │
│  • Memoization ready                    │
│                                          │
│ Backend:                                 │
│  • Rate limiting (20 req/min)          │
│  • Response caching ready               │
│  • Retry logic (3 attempts)            │
│  • Error fallbacks                      │
│                                          │
│ Network:                                 │
│  • Gzip compression                     │
│  • CDN ready                            │
│  • HTTP/2                               │
└─────────────────────────────────────────┘
```

---

## 🔄 Deployment Architecture

### Vercel Deployment

```
┌──────────────────────────────────────────────────────┐
│                  Vercel Platform                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌────────────────────┐    ┌────────────────────┐  │
│  │   Frontend App     │    │   Backend API      │  │
│  │                    │    │                    │  │
│  │  • Static files    │    │  • Serverless      │  │
│  │  • React SPA       │    │  • Express routes  │  │
│  │  • CDN cached      │    │  • Gemini service  │  │
│  └────────────────────┘    └────────────────────┘  │
│           │                          │              │
│           │                          │              │
│           ▼                          ▼              │
│  ┌────────────────────┐    ┌────────────────────┐  │
│  │   Edge Network     │    │   Serverless       │  │
│  │   (Global CDN)     │    │   Functions        │  │
│  └────────────────────┘    └────────────────────┘  │
│                                                       │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Google Gemini   │
              │      API         │
              └──────────────────┘
```

---

## 📚 Technology Stack Summary

### Frontend Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State**: Zustand
- **Routing**: React Router v6
- **HTTP**: Axios
- **Icons**: Lucide React

### Backend Stack
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Language**: TypeScript
- **AI**: Google Gemini 2.5 Pro
- **Validation**: Custom middleware
- **Rate Limiting**: Custom implementation

### DevOps Stack
- **Deployment**: Vercel
- **Version Control**: Git
- **Package Manager**: npm
- **CI/CD**: Vercel auto-deploy

---

## 🎯 Design Patterns

### Frontend Patterns
- **Component Pattern**: Functional components with hooks
- **Container/Presentational**: Separation of logic and UI
- **Custom Hooks**: Reusable logic (ready for implementation)
- **Context Pattern**: Toast notifications
- **Store Pattern**: Zustand for global state

### Backend Patterns
- **MVC Pattern**: Routes → Services → Response
- **Middleware Pattern**: Request processing pipeline
- **Service Layer**: Business logic separation
- **Error Handling**: Centralized error handling
- **Retry Pattern**: Gemini API calls

---

**Arhitektūra ir moderna, skalējama un maintainable!** ✅


