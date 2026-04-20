# AlexSys Stage - Stock Pilot Management System

A modern, full-featured inventory management application built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**. This application provides comprehensive management for warehouse inventory, storage infrastructure, and organizational hierarchy.

## 📋 Project Overview

**AlexSys Stage** is an enterprise-level warehouse management system designed to manage:
- Companies (Sociétés)
- Sites and Locations
- Zones (Storage Zones)
- Aisles (Allées)
- Racks (Storage Racks)
- Ranges (Shelf Ranges)
- Floors/Levels (Étages)

---

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.6.2
- **Build Tool**: Vite 6.0.5
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.1.1
- **State Management**: React Context API
- **HTTP Client**: Axios 1.7.9
- **UI Components**: FontAwesome, React Icons, SweetAlert2
- **Charts**: ApexCharts & D3.js
- **Form Validation**: Formik 2.4.6 + Yup 1.6.1
- **Animations**: Framer Motion 12.0.11

---

## 📁 Directory Structure

```
src/
├── App.tsx                    # Main application component with routing
├── main.tsx                   # React application entry point
├── index.css                  # Global styles
├── vite-env.d.ts             # Vite environment type definitions
│
├── layout/                    # Shared layout components
│   ├── Header.tsx            # Top navigation header
│   ├── Sidebar.tsx           # Left navigation sidebar
│   └── Footer.tsx            # Footer component
│
├── Login/                     # Authentication module
│   ├── Login.tsx             # Login page component
│   ├── ForgotPassword.tsx    # Password recovery page
│   ├── core/                 # Authentication utilities
│   │   ├── AuthContext.tsx   # Auth context provider (currently commented)
│   │   ├── _models.ts        # Auth data models/interfaces
│   │   └── _requets.ts       # Auth API endpoints
│   └── _requests.ts          # Login API calls
│
├── Dashboard/                # Dashboard module
│   ├── Dashboard.tsx         # Main dashboard page
│   ├── RosenChart.tsx        # Chart visualization component
│   └── _requests.ts          # Dashboard API endpoints
│
├── Loading/                  # Loading states
│   └── Loading.tsx           # Loading spinner component
│
├── Pages/                    # Business logic pages (CRUD operations)
│   ├── Societes/            # Companies management
│   │   ├── SocietesTable.tsx         # Companies table/list view
│   │   ├── _request.ts               # Companies API calls
│   │   └── partial/
│   │       ├── AddSocietes.tsx       # Add company form
│   │       ├── EditSociete.tsx       # Edit company form
│   │       └── SearchFormSociete.tsx # Company search form
│   │
│   ├── Sites/               # Sites management
│   │   ├── SitesList.tsx             # Sites list page
│   │   ├── SitesTable.tsx            # Sites table component
│   │   ├── _request.ts               # Sites API calls
│   │   └── partial/
│   │       ├── AddSites.tsx          # Add site form
│   │       ├── EditSites.tsx         # Edit site form
│   │       └── SearchFormSites.tsx   # Site search form
│   │
│   ├── Zones/               # Zones management
│   │   ├── ZonesList.tsx             # Zones list page
│   │   ├── ZonesTable.tsx            # Zones table component
│   │   ├── _request.ts               # Zones API calls
│   │   └── partial/
│   │       ├── AddZones.tsx          # Add zone form
│   │       ├── EditZones.tsx         # Edit zone form
│   │       └── SearchFormZone.tsx    # Zone search form
│   │
│   ├── Allees/              # Aisles management
│   │   ├── AlleesList.tsx            # Aisles list page
│   │   ├── AlleesTable.tsx           # Aisles table component
│   │   ├── _request.ts               # Aisles API calls
│   │   └── partial/
│   │       ├── AddAllees.tsx         # Add aisle form
│   │       └── EditAllee.tsx         # Edit aisle form
│   │
│   ├── Rack/                # Racks management
│   │   ├── RacksList.tsx             # Racks list page
│   │   ├── RacksTable.tsx            # Racks table component
│   │   ├── _request.ts               # Racks API calls
│   │   └── partial/
│   │       ├── AddRacks.tsx          # Add rack form
│   │       └── EditRacks.tsx         # Edit rack form
│   │
│   ├── Range/               # Ranges management
│   │   ├── RangeList.tsx             # Ranges list page (inferred)
│   │   ├── RangeTable.tsx            # Ranges table component
│   │   ├── _request.ts               # Ranges API calls
│   │   └── partial/
│   │       └── AddRange.tsx          # Add range form
│   │
│   └── Etage/               # Floors/Levels management
│       ├── EtageList.tsx             # Floors list page (inferred)
│       ├── EtagesTable.tsx           # Floors table component
│       ├── _request.ts               # Floors API calls
│       └── partial/                  # (Forms structure inferred)
│
└── assets/                   # Static assets (images, icons, etc.)
```

---

## 🗂️ Architecture Patterns

### 1. **Module-Based Organization**
Each feature (Societes, Sites, Zones, etc.) is a self-contained module:
- **List Component**: Shows all items with filtering/search (`*List.tsx`)
- **Table Component**: Data table view (`*Table.tsx`)
- **Partial Components**: Reusable forms (`partial/Add*.tsx`, `partial/Edit*.tsx`)
- **API Layer**: API calls and data models (`_request.ts`)

### 2. **Layered Architecture**

```
Presentation Layer (Components)
          ↓
State Management (React Context)
          ↓
API Layer (Axios)
          ↓
Backend API (Azure)
```

### 3. **Component Hierarchy**

```
App (Root)
├── Header
├── Sidebar
├── Routes
│   ├── Login Page
│   ├── Dashboard
│   └── Pages (Societes, Sites, Zones, etc.)
│       ├── *List Component
│       ├── *Table Component
│       └── Partials (Forms)
└── Footer
```

---

## 🔄 Data Flow

### Page Module Data Flow
```
1. User interacts with component (List/Table)
                ↓
2. Component calls _request.ts (API Layer)
                ↓
3. Axios fetches from backend API
                ↓
4. Data returned and stored in React state
                ↓
5. Component renders with data
                ↓
6. User can Add/Edit/Delete via partial forms
```

### Example: Societies (Societes) Flow
```
SocietesTable.tsx
    ↓
    Displays list from _request.ts (getSocietes())
    ↓
    User clicks "Add" → AddSocietes.tsx form
    ↓
    Form submits → _request.ts (createSociete())
    ↓
    API response → Refresh table
```

---

## 📡 API Integration

**Base URL**: `https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api`

Each module has its endpoint:
- `/api/Allee` - Aisles
- `/api/Etage` - Floors
- `/api/Rack` - Racks
- `/api/Range` - Ranges
- `/api/Site` - Sites
- `/api/Societe` - Companies
- `/api/Zone` - Zones

---

## 🔐 Authentication

- Located in `Login/` module
- Uses Context API (Currently disabled/commented in `AuthContext.tsx`)
- Stores: Token, ClientId
- Features: Login, Logout, Forgot Password

---

## 🎨 UI/UX Features

- **Dark/Light Mode Support**: Tailwind CSS theming
- **Responsive Design**: Mobile-first with Tailwind
- **Charts & Visualizations**: ApexCharts + D3.js in Dashboard
- **Form Validation**: Formik + Yup for robust validation
- **Animations**: Framer Motion for smooth transitions
- **Icons**: FontAwesome + React Icons
- **Alerts**: SweetAlert2 for user feedback
- **Loading States**: React Spinners

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Runs dev server at `http://localhost:5173` with HMR enabled

### Build
```bash
npm run build
```
Compiles TypeScript and builds optimized production bundle

### Lint
```bash
npm run lint
```
Checks code for ESLint violations

### Preview
```bash
npm run preview
```
Tests the production build locally

---

## 🏭 Production Deployment

### Docker
```bash
docker build -t alexsys-stage .
docker run -p 8080:80 alexsys-stage
```

See `DOCKER_CICD_SETUP.md` for complete Docker & CI/CD setup.

### CI/CD Pipeline
- GitHub Actions workflows configured
- Automatic linting, type checking, and Docker builds
- Security scanning with Trivy
- See `.github/workflows/` for details

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| react 18.3.1 | UI framework |
| typescript 5.6.2 | Type safety |
| vite 6.0.5 | Build tool |
| tailwindcss 3.4.17 | Styling |
| axios 1.7.9 | HTTP requests |
| formik 2.4.6 | Form management |
| yup 1.6.1 | Schema validation |
| react-router-dom 7.1.1 | Routing |
| apexcharts 4.4.0 | Charts |
| framer-motion 12.0.11 | Animations |

---

## 🔧 Configuration Files

- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugins
- `eslint.config.js` - Linting rules
- `Dockerfile` - Docker build configuration
- `nginx.conf` - Nginx server configuration

---

## 🐛 Troubleshooting

### Port already in use?
```bash
npm run dev -- --port 3000
```

### Module not found errors?
```bash
npm ci  # Clean install
npm run build
```

### Type errors?
```bash
npx tsc --noEmit
```

---

## 📝 Code Standards

- **Language**: TypeScript (strict mode)
- **Framework**: React with Hooks
- **Styling**: Tailwind CSS utility classes
- **Naming**: PascalCase for components, camelCase for functions
- **Folder Structure**: Feature-based modules
- **API Calls**: Centralized in `_request.ts` files

---

## 🚀 Future Enhancements

- [ ] Implement React Context Auth (currently commented)
- [ ] Add unit and integration tests
- [ ] Implement state management (Redux/Zustand)
- [ ] Add error boundary components
- [ ] Implement real-time updates with WebSockets
- [ ] Add accessibility (a11y) improvements
- [ ] Implement PWA features

---

## 📞 Support

For issues or questions, refer to the official documentation:
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
