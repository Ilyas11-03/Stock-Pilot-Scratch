# 🎯 Architecture Summary & Visual Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         AlexSys Stage                            │
│                    (React + TypeScript + Vite)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         Application Layer (App.tsx)     │
        │  - Router Configuration                 │
        │  - Global Layout Setup                  │
        │  - Route Protection                     │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────┐
│  Authentication  │                    │  Main Application│
│     Layer        │                    │      Layout      │
│                  │                    │                  │
│  - Login         │                    │  - Header        │
│  - Logout        │                    │  - Sidebar       │
│  - Forgot Pass   │                    │  - Footer        │
│  - Auth Context  │                    │  - Routes        │
└──────────────────┘                    └──────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
   ┌─────────────┐                        ┌───────────────┐
   │  Dashboard  │                        │  Pages Module │
   │             │                        │               │
   │ - Dashboard │                        └───────────────┘
   │ - Charts    │                                │
   │ - Analytics │              ┌─────────────────┼─────────────────┐
   └─────────────┘              │                 │                 │
                        ┌───────▼────┐     ┌──────▼─────┐    ┌──────▼─────┐
                        │  Societes  │     │   Sites    │    │   Zones    │
                        │   Module   │     │   Module   │    │   Module   │
                        └────────────┘     └────────────┘    └────────────┘
                        │                 │                 │
                        ├─ List.tsx       ├─ List.tsx       ├─ List.tsx
                        ├─ Table.tsx      ├─ Table.tsx      ├─ Table.tsx
                        ├─ _request.ts    ├─ _request.ts    ├─ _request.ts
                        └─ partial/       └─ partial/       └─ partial/
                                                │
                        ┌───────────────┬──────┴──────┬──────────────┐
                        │               │             │              │
                        ▼               ▼             ▼              ▼
                    ┌────────┐      ┌────────┐   ┌────────┐    ┌────────┐
                    │ Allees │      │ Racks │   │ Range  │    │ Etages │
                    │ Module │      │ Module│   │ Module │    │ Module │
                    └────────┘      └────────┘   └────────┘    └────────┘
```

---

## Module Relationship Diagram

```
Hierarchy: Societe > Site > Zone > Allee > Rack > Range > Etage

┌─────────────────────────────────────────────────────────────┐
│                      COMPANIES                               │
│                    (Societes Module)                         │
│                   [Entities: 1-N Sites]                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         SITES                                │
│                    (Sites Module)                            │
│            [Each Site has: Zones, Warehouses]                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        ZONES                                 │
│                    (Zones Module)                            │
│          [Warehouse subdivisions: 1-N Aisles]                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AISLES (ALLEES)                          │
│                   (Allees Module)                            │
│            [Storage corridors: 1-N Racks]                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      RACKS                                   │
│                    (Racks Module)                            │
│           [Storage structures: 1-N Ranges]                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      RANGES                                  │
│                    (Range Module)                            │
│              [Shelf groups: 1-N Levels]                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FLOORS/LEVELS (ETAGES)                    │
│                    (Etage Module)                            │
│                [Individual shelf levels]                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Lifecycle Flow

### Page Module Lifecycle

```
Component Mount
      │
      ▼
┌─────────────────────────┐
│ useEffect: Fetch Data   │
│ - Call _request.ts      │
│ - Set Loading = true    │
└─────────────────────────┘
      │
      ▼
┌─────────────────────────┐
│ Axios Request           │
│ - GET to Backend API    │
└─────────────────────────┘
      │
      ┌─────────────────────────────────────────┐
      │                                         │
      ▼ (Success)                    ▼ (Error)
┌──────────────────┐           ┌──────────────────┐
│ Set Data State   │           │ Set Error State  │
│ Set Loading = F  │           │ Show Error Alert │
└──────────────────┘           └──────────────────┘
      │                                 │
      └─────────────────────────────────┘
                      │
                      ▼
          ┌─────────────────────────┐
          │ Render Components       │
          │ - Table with Data       │
          │ - Action Buttons        │
          │ - Search/Filter         │
          └─────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
    ┌──────────────┐      ┌──────────────┐
    │ User Action: │      │ User Action: │
    │ Add/Edit     │      │ Delete       │
    │ - Open Modal │      │ - Confirm    │
    │ - Form Vals  │      │ - Call API   │
    │ - Submit     │      │ - Refresh    │
    └──────────────┘      └──────────────┘
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
          ┌─────────────────────────┐
          │ Success Notification    │
          │ Refresh Data Table      │
          └─────────────────────────┘
```

---

## Data Layer Architecture

```
┌───────────────────────────────────────────────────────┐
│             Frontend (React Components)                │
│  - Display data                                        │
│  - Handle user interactions                            │
│  - Form inputs                                         │
└───────────────────────────────────────────────────────┘
                          ▲
                          │
                  API Calls via Axios
                          │
                          ▼
┌───────────────────────────────────────────────────────┐
│          API Layer (_request.ts files)                 │
│  - API URL configuration                              │
│  - Type definitions/Interfaces                        │
│  - CRUD functions (GET, POST, PUT, DELETE)            │
│  - Error handling                                     │
└───────────────────────────────────────────────────────┘
                          ▲
                          │
                     HTTP Requests
                    (HTTPS Protocol)
                          │
                          ▼
┌───────────────────────────────────────────────────────┐
│        Backend API (Azure Cloud)                       │
│  https://stockpiloteapi-d8cwagb0hfhzfyau...           │
│                                                        │
│  Available Endpoints:                                  │
│  - /api/Societe                                       │
│  - /api/Site                                          │
│  - /api/Zone                                          │
│  - /api/Allee                                         │
│  - /api/Rack                                          │
│  - /api/Range                                         │
│  - /api/Etage                                         │
└───────────────────────────────────────────────────────┘
                          ▲
                          │
                          │
                          ▼
┌───────────────────────────────────────────────────────┐
│               Database Layer                           │
│  - SQL Server / Cosmos DB / etc.                      │
│  - Data Persistence                                   │
│  - Backups & Recovery                                 │
└───────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
User visits application
          │
          ▼
┌─────────────────────┐
│ Is user logged in?  │
└─────────────────────┘
      ┌──────┴──────┐
      │             │
   NO ▼             ▼ YES
┌──────────────┐  ┌─────────────────┐
│ Show Login   │  │ Check Auth Token│
│ Page         │  │ Token Valid?    │
└──────────────┘  └─────────────────┘
      │                  ┌────┴────┐
      │              YES │         │ NO
      │                  ▼         ▼
      │            ┌──────────┐  ┌──────────┐
      │            │ Load App │  │ Show     │
      │            │ Dashboard   │ Login    │
      │            └──────────┘  └──────────┘
      │                          │
      ├──User enters  ────────────┘
      │  credentials
      │
      ▼
┌──────────────────────────┐
│ Validate Form (Formik)   │
│ - Email required         │
│ - Password required      │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ POST to Login API        │
│ /api/login or similar    │
└──────────────────────────┘
      │
      ┌──────┬──────┐
      ▼      ▼
  SUCCESS ERROR
      │      │
      │      ▼
      │  ┌──────────────┐
      │  │ Show Error   │
      │  │ Toast/Alert  │
      │  └──────────────┘
      │
      ▼
┌──────────────────────────┐
│ Store Token              │
│ - In State or            │
│ - In LocalStorage        │
│ - In Cookies             │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Redirect to Dashboard    │
│ - Load main app          │
│ - Initialize sidebar     │
└──────────────────────────┘
```

---

## Type System Architecture

```typescript
// Global Types
├── API Response Types (User, Company, Site, etc.)
├── Form Payload Types (Create*, Update*)
├── Component Props Types (Interface Props)
└── State Types (useState<Type>)

// File Organization
src/Pages/[Module]/_request.ts
├── export interface Entity { ... }
├── export interface CreateEntityPayload { ... }
├── export interface UpdateEntityPayload { ... }
└── export const ApiFunction = async () => { ... }

// Usage in Components
src/Pages/[Module]/[Module]List.tsx
├── import { Entity, CreateEntityPayload, getEntities } from './_request'
├── const [data, setData] = useState<Entity[]>([])
└── // Component uses types throughout
```

---

## State Management Flow

### Current Authentication State

```
┌──────────────────────────────────┐
│  AuthContext (Currently unused)   │
│                                   │
│  - token: string | null          │
│  - clientId: string | null       │
│  - login(): void                 │
│  - logout(): void                │
└──────────────────────────────────┘
```

### Component State Pattern

```typescript
// Each module manages its own state

const [data, setData] = useState<Entity[]>([])
     ↑      ↑
  Data    Setter

const [loading, setLoading] = useState<boolean>(false)
     ↑          ↑
Status        Setter

const [error, setError] = useState<string | null>(null)
     ↑      ↑
Error    Setter
```

---

## File Naming Conventions

| Pattern | Purpose | Example |
|---------|---------|---------|
| `*.tsx` | React Components | `SocietesTable.tsx` |
| `_request.ts` | API Layer | `_request.ts` |
| `_models.ts` | Type Definitions | `_models.ts` |
| `_requets.ts` | API (Alternative) | `_requets.ts` (sic - typo?) |
| `partial/*` | Sub-components | `AddSocietes.tsx` |
| `.env` | Environment Config | `.env.local` |
| `.test.ts` | Unit Tests | `Component.test.tsx` |

---

## Performance Optimization Opportunities

### Current
```
─────────────────────────────
Component renders on every change
State updates cause re-renders
No memoization
─────────────────────────────
```

### Recommended
```
─────────────────────────────
✅ Use React.memo()
✅ useCallback for functions
✅ useMemo for computed values
✅ Lazy load routes
✅ Code splitting
✅ Pagination for large lists
─────────────────────────────
```

---

## Deployment Architecture

### Development
```
npm run dev
    ↓
Vite Dev Server (http://localhost:5173)
    ↓
Hot Module Replacement (HMR)
```

### Production Build
```
npm run build
    ↓
TypeScript Compilation
    ↓
Vite Bundle Optimization
    ↓
Output: dist/ folder
```

### Docker Container
```
Dockerfile (Multi-stage build)
    ↓
Build Stage: npm run build
    ↓
Production Stage: Nginx server
    ↓
Container: Port 80
```

### CI/CD Pipeline
```
Git Push (main branch)
    ↓
GitHub Actions Trigger
    ├─ Lint (ESLint)
    ├─ Type Check (TypeScript)
    ├─ Build (Vite)
    ├─ Docker Build
    └─ Security Scan (Trivy)
    ↓
Container Registry (ghcr.io)
    ↓
Ready for Deployment
```

---

## Quick Reference: Module Structure

```
module/
├── [Module]List.tsx          ← Main page (containers & layout)
├── [Module]Table.tsx         ← Table display (presentational)
├── _request.ts               ← API calls & types
└── partial/
    ├── Add[Module].tsx       ← Add form (controlled by Formik)
    ├── Edit[Module].tsx      ← Edit form (controlled by Formik)
    └── SearchForm[Module].tsx ← Search/filter form
```

---

## Environment Setup

```
Development
├── Node.js 18+
├── npm/yarn
├── Vite Dev Server
└── Browser DevTools

Production  
├── Docker
├── Nginx
├── SSL/TLS
└── Cloud Platform (Azure/AWS/GCP)
```

---

## Resources & Documentation Links

- **Project Docs**: See `README.md`
- **Architecture Details**: See `ARCHITECTURE.md`
- **Docker & CI/CD**: See `DOCKER_CICD_SETUP.md`
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Vite**: https://vite.dev
- **Tailwind**: https://tailwindcss.com
