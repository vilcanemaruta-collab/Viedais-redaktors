# Contribution Guide

## Kā Piedalīties Projektā

Paldies par interesi piedalīties Viedā Teksta Redaktora attīstībā! Šis dokuments palīdzēs jums sākt.

## Vides Sagatavošana

### Priekšnosacījumi
- Node.js 18 vai jaunāks
- npm vai yarn
- Git
- Teksta redaktors (VS Code ieteicams)

### Instalācija

```bash
# Clone repository
git clone <repository-url>
cd Viedais-redaktors

# Instalēt visas dependencies
npm run install:all

# Vai manuāli
cd frontend && npm install
cd ../backend && npm install
```

## Development Workflow

### 1. Izveidot jaunu branch

```bash
git checkout -b feature/jauna-funkcija
# vai
git checkout -b fix/kludas-labojums
```

### 2. Veikt izmaiņas

Strādājiet savā branch un commit regulāri:

```bash
git add .
git commit -m "feat: pievieno jaunu funkciju"
```

### Commit Message Convention

Izmantojam Conventional Commits:

- `feat:` - Jauna funkcionalitāte
- `fix:` - Bug fix
- `docs:` - Dokumentācijas izmaiņas
- `style:` - Code style izmaiņas (formatēšana)
- `refactor:` - Code refactoring
- `test:` - Testu pievienošana
- `chore:` - Build process vai auxiliary tools

Piemēri:
```
feat: pievieno PDF eksportu
fix: labo lasāmības indeksa aprēķinu
docs: atjaunina README ar deployment instrukcijām
```

### 3. Testēt izmaiņas

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev

# Vai abas vienlaicīgi no root
npm run dev
```

### 4. Pārbaudīt kodu

```bash
# TypeScript type checking
cd frontend && npm run build
cd backend && npm run build

# Linting (ja konfigurēts)
npm run lint
```

### 5. Push un Pull Request

```bash
git push origin feature/jauna-funkcija
```

Pēc tam izveidojiet Pull Request GitHub.

## Koda Stils

### TypeScript/React

```typescript
// Izmantojiet funkciju komponentes
export default function MyComponent() {
  // Hooks vispirms
  const [state, setState] = useState();
  const store = useStore();
  
  // Event handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
}
```

### Naming Conventions

- **Komponentes**: PascalCase (`TextInput.tsx`)
- **Funkcijas**: camelCase (`calculateMetrics`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_LENGTH`)
- **Types/Interfaces**: PascalCase (`TextSettings`)
- **CSS klases**: kebab-case (`btn-primary`)

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API services
├── stores/         # State management
├── types/          # TypeScript types
├── utils/          # Utility functions
└── hooks/          # Custom React hooks (ja nepieciešams)
```

## Jaunu Funkciju Pievienošana

### Frontend Komponente

1. Izveidot failu `frontend/src/components/MyComponent.tsx`
2. Implementēt komponentu
3. Eksportēt no komponentes
4. Importēt un izmantot vajadzīgajā vietā

### Backend Endpoint

1. Izveidot route `backend/src/routes/myRoute.ts`
2. Implementēt endpoint logic
3. Pievienot validation middleware
4. Importēt routes `backend/src/index.ts`

### Jauna Utilīta

1. Izveidot failu `frontend/src/utils/myUtil.ts`
2. Implementēt funkciju ar TypeScript tipiem
3. Eksportēt funkciju
4. Pievienot unit testus (nākotnē)

## Testing

### Manuālā Testēšana

Pirms commit:
- [ ] Pārbaudīt visās 3 valodās (LV, RU, EN)
- [ ] Pārbaudīt dark mode
- [ ] Pārbaudīt responsive design
- [ ] Pārbaudīt error handling

### Automated Testing (Nākotne)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Dokumentācija

Ja pievienojat jaunu funkcionalitāti:
1. Atjauniniet README.md
2. Pievienojiet komentārus kodā
3. Atjauniniet API dokumentāciju (ja vajadzīgs)
4. Pievienojiet piemērus

## Pull Request Process

1. **Apraksts**: Skaidri aprakstiet izmaiņas
2. **Screenshots**: Pievienojiet UI izmaiņām
3. **Testing**: Aprakstiet kā testējāt
4. **Breaking Changes**: Norādiet, ja ir
5. **Documentation**: Atjauniniet dokumentāciju

### PR Template

```markdown
## Izmaiņu Apraksts
[Aprakstiet izmaiņas]

## Izmaiņu Tips
- [ ] Bug fix
- [ ] Jauna funkcionalitāte
- [ ] Breaking change
- [ ] Dokumentācija

## Testēšana
[Kā testējāt izmaiņas]

## Screenshots
[Ja attiecināms]

## Checklist
- [ ] Kods kompilējas bez kļūdām
- [ ] Nav linter warnings
- [ ] Testēts visās valodās
- [ ] Dokumentācija atjaunināta
- [ ] Commit messages atbilst konvencijai
```

## Koda Pārskatīšana

Kad veicat code review:
- Pārbaudiet koda kvalitāti
- Pārbaudiet vai ir testi
- Pārbaudiet dokumentāciju
- Testējiet funkcionalitāti
- Sniedziet konstruktīvu feedback

## Problēmu Ziņošana

### Bug Report

Izmantojiet šo template:

```markdown
**Apraksts**
[Īss problēmas apraksts]

**Reproducēšana**
1. [Pirmais solis]
2. [Otrais solis]
3. [Trešais solis]

**Sagaidāmā uzvedība**
[Ko vajadzēja notikt]

**Faktiskā uzvedība**
[Kas notika]

**Vide**
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Versija: [commit hash]

**Screenshots**
[Ja iespējams]
```

### Feature Request

```markdown
**Funkcionalitātes Apraksts**
[Ko vēlaties pievienot]

**Motivācija**
[Kāpēc tas ir nepieciešams]

**Alternatīvas**
[Citi risinājumi, ko apsvērāt]

**Papildu Konteksts**
[Jebkas cits, kas varētu būt noderīgs]
```

## Projekta Struktūra

### Frontend

- **components/** - Reusable UI komponentes
- **pages/** - Lapas (routes)
- **services/** - API integrācija
- **stores/** - State management (Zustand)
- **types/** - TypeScript type definitions
- **utils/** - Helper funkcijas

### Backend

- **routes/** - API endpoints
- **services/** - Business logic (Gemini)
- **middleware/** - Express middleware
- **utils/** - Helper funkcijas

## Labākās Prakses

### React

1. Izmantojiet functional components
2. Izmantojiet hooks pareizi
3. Memoize expensive calculations
4. Izvairieties no prop drilling (izmantojiet stores)
5. Keep components small and focused

### TypeScript

1. Vienmēr definējiet tipus
2. Izvairieties no `any`
3. Izmantojiet interfaces priekš objektiem
4. Izmantojiet type guards
5. Leverage TypeScript's type inference

### Performance

1. Lazy load components
2. Debounce expensive operations
3. Memoize calculations
4. Optimize re-renders
5. Use production builds

## Resursi

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

## Jautājumi?

Ja jums ir jautājumi:
1. Pārbaudiet dokumentāciju
2. Meklējiet līdzīgas issues
3. Izveidojiet jaunu issue
4. Sazinieties ar komandu

## Pateicības

Paldies par jūsu ieguldījumu! Katrs contribution palīdz uzlabot projektu.

---

**Happy Coding!** 🚀

