# 📚 Developer Quick Reference

A rapid-access guide for developers working on AlexSys Stage.

---

## Project Info at a Glance

| Aspect | Details |
|--------|---------|
| **Project Name** | AlexSys Stage - Stock Pilot |
| **Type** | React SPA (Single Page Application) |
| **Language** | TypeScript |
| **Build Tool** | Vite 6.0.5 |
| **Style** | Tailwind CSS 3.4.17 |
| **Node Version** | 18+ |
| **Backend API** | Azure REST API |
| **Docker** | Nginx + Alpine Linux |

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview

# Docker build
docker build -t alexsys-stage .

# Docker run
docker run -p 8080:80 alexsys-stage

# Docker Compose
docker-compose up
```

---

## Project Structure Cheat Sheet

```
src/
├── App.tsx                           ← Root component & routes
├── layout/                           ← Shared UI layout
│   ├── Header.tsx, Sidebar.tsx, Footer.tsx
├── Login/                            ← Auth module
│   ├── Login.tsx, ForgotPassword.tsx
│   └── core/ (AuthContext, models)
├── Dashboard/                        ← Dashboard module
│   ├── Dashboard.tsx, RosenChart.tsx
│   └── _requests.ts
└── Pages/                            ← Business entities
    ├── Societes/, Sites/, Zones/
    ├── Allees/, Racks/, Ranges/
    └── Etages/
        ├── *List.tsx (main page)
        ├── *Table.tsx (table display)
        ├── _request.ts (API)
        └── partial/ (forms)
```

---

## Module Template

Use this when creating a new entity:

### 1. Create API Layer
**File**: `src/Pages/Entity/_request.ts`
```typescript
import axios from 'axios';

const API_URL = 'https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api/Entity';

export interface Entity {
  id: number;
  name: string;
}

export const getEntities = async () => axios.get(API_URL);
export const createEntity = async (data: Entity) => axios.post(API_URL, data);
export const updateEntity = async (id: number, data: Entity) => axios.put(`${API_URL}/${id}`, data);
export const deleteEntity = async (id: number) => axios.delete(`${API_URL}/${id}`);
```

### 2. Create List Component
**File**: `src/Pages/Entity/EntityList.tsx`
```typescript
import { Entity, getEntities } from './_request';

const EntityList: React.FC = () => {
  const [data, setData] = useState<Entity[]>([]);
  
  useEffect(() => {
    getEntities().then(res => setData(res.data));
  }, []);
  
  return (
    <div>
      <EntityTable data={data} />
    </div>
  );
};
```

### 3. Create Table Component
**File**: `src/Pages/Entity/EntityTable.tsx`
```typescript
interface Props {
  data: Entity[];
}

const EntityTable: React.FC<Props> = ({ data }) => {
  return (
    <table>
      <thead>
        <tr><th>Name</th></tr>
      </thead>
      <tbody>
        {data.map(item => <tr key={item.id}><td>{item.name}</td></tr>)}
      </tbody>
    </table>
  );
};
```

### 4. Create Forms
**File**: `src/Pages/Entity/partial/AddEntity.tsx`
```typescript
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createEntity } from '../_request';

const AddEntity: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: Yup.object({ name: Yup.string().required() }),
    onSubmit: async (values) => {
      await createEntity(values);
      onSuccess();
    },
  });

  return <form onSubmit={formik.handleSubmit}>...</form>;
};
```

### 5. Add Route
**File**: `src/App.tsx`
```typescript
import EntityList from './Pages/Entity/EntityList';

<Route path="/entity" element={<EntityList />} />
```

---

## Common Patterns

### Fetch Data with Error Handling
```typescript
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      const res = await getItems();
      setData(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

### Form with Formik Validation
```typescript
const formik = useFormik({
  initialValues: { name: '', email: '' },
  validationSchema: Yup.object({
    name: Yup.string().required('Required').min(3),
    email: Yup.string().email('Invalid').required(),
  }),
  onSubmit: async (values) => {
    try {
      await createItem(values);
      Swal.fire('Success!', 'Item created', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to create', 'error');
    }
  },
});

return (
  <form onSubmit={formik.handleSubmit}>
    <input {...formik.getFieldProps('name')} />
    {formik.errors.name && <span>{formik.errors.name}</span>}
  </form>
);
```

---

## API Integration

### Base URL
```
https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api
```

### Endpoints
| Entity | Endpoint |
|--------|----------|
| Companies | `/api/Societe` |
| Sites | `/api/Site` |
| Zones | `/api/Zone` |
| Aisles | `/api/Allee` |
| Racks | `/api/Rack` |
| Ranges | `/api/Range` |
| Floors | `/api/Etage` |

### Standard HTTP Methods
```
GET     /api/Entity        ← Get all
POST    /api/Entity        ← Create
PUT     /api/Entity/{id}   ← Update
DELETE  /api/Entity/{id}   ← Delete
```

---

## Type Definitions Patterns

```typescript
// Data Model
export interface Entity {
  id: number;
  name: string;
  createdAt?: string;
}

// Create Payload
export interface CreateEntityPayload {
  name: string;
}

// Update Payload
export interface UpdateEntityPayload {
  name?: string;
}

// Component Props
interface EntityTableProps {
  data: Entity[];
  onEdit: (item: Entity) => void;
  onDelete: (id: number) => void;
}
```

---

## Styling Conventions

### Tailwind Classes by Category
```typescript
// Layout
className="flex gap-4 p-4 bg-white rounded-lg"

// Responsive
className="w-full md:w-1/2 lg:w-1/3"

// Colors
className="text-gray-700 bg-blue-50 border border-blue-200"

// Hover/Active States
className="hover:bg-gray-100 active:bg-gray-200"

// Dark Mode
className="dark:bg-gray-800 dark:text-white"

// Combined
className="mx-auto my-4 px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
```

---

## Debugging Tips

### Console Logging
```typescript
console.log('Data:', data);           // Basic log
console.error('Error:', error);       // Error
console.warn('Warning:', warning);    // Warning
console.table(arrayOfObjects);        // Table format
```

### React DevTools
```
1. Install React DevTools extension
2. Open DevTools (F12)
3. Go to Components tab
4. Inspect component hierarchy
5. View props and state
```

### Network Debugging
```
1. Open DevTools (F12)
2. Network tab
3. Make API call
4. See request/response
5. Check status, headers, body
```

### Type Checking
```bash
# Check all TypeScript errors
npx tsc --noEmit

# Check specific file
npx tsc --noEmit src/Pages/Entity/EntityList.tsx
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **CORS Error** | Check backend CORS headers, use proxy |
| **Type Error** | Check interface definition, use `as Type` cautiously |
| **404 API** | Verify endpoint URL, check network tab |
| **Stale Data** | Add refresh button or refetch after mutation |
| **Slow Render** | Check React DevTools Profiler, memoize |
| **Build Error** | Run `npm ci`, check TypeScript errors |

---

## Environment Variables

### Create `.env.local`
```bash
VITE_API_BASE_URL=https://your-api.com
VITE_APP_NAME=AlexSys Stage
```

### Use in Code
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Best Practices Checklist

- [ ] Use TypeScript strict mode
- [ ] Add proper error handling (try-catch)
- [ ] Validate form inputs with Yup
- [ ] Use meaningful variable names
- [ ] Add JSDoc comments for complex functions
- [ ] Keep components small and focused
- [ ] Extract reusable logic to custom hooks
- [ ] Use `React.memo()` for expensive components
- [ ] Add loading and error states
- [ ] Test critical user flows
- [ ] Use console for debugging, not in production
- [ ] Follow naming conventions consistently

---

## File Naming Conventions

```
Components:        PascalCase       SocietesTable.tsx
Functions:         camelCase        getSocieties()
Constants:         UPPER_SNAKE      API_BASE_URL
Interfaces:        PascalCase       interface Entity {}
Files (API):       _request.ts      _request.ts
Files (Models):    _models.ts       _models.ts
Tests:             .test.ts         Component.test.tsx
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-entity

# Make changes
# ...

# Commit with clear message
git commit -m "feat: add new entity module"

# Push to repository
git push origin feature/add-entity

# Create Pull Request on GitHub
# Wait for review and CI/CD
# Merge when approved
```

---

## Performance Tips

1. **Lazy Load Routes**
   ```typescript
   const EntityList = React.lazy(() => import('./Pages/Entity/EntityList'));
   ```

2. **Memoize Components**
   ```typescript
   export const EntityTable = React.memo(Component);
   ```

3. **Optimize Functions**
   ```typescript
   const handleEdit = useCallback((item) => { ... }, []);
   ```

4. **Pagination for Lists**
   - Fetch only needed data
   - Implement "Load more" or pagination

5. **Bundle Size**
   - Check with `npm run build --report`
   - Remove unused dependencies

---

## Useful Extensions

### VS Code Extensions
- **ESLint**: Lint in editor
- **Prettier**: Format code
- **Thunder Client**: Test APIs
- **React DevTools**: Inspect React
- **TypeScript Vue Plugin**: Type support

---

## Resources

| Resource | Link |
|----------|------|
| React | https://react.dev |
| TypeScript | https://www.typescriptlang.org |
| Vite | https://vite.dev |
| Tailwind | https://tailwindcss.com |
| Axios | https://axios-http.com |
| Formik | https://formik.org |
| Full Docs | See `README.md`, `ARCHITECTURE.md` |

---

## Contact & Support

For architecture questions, refer to:
- **General Overview**: `README.md`
- **Technical Details**: `ARCHITECTURE.md`
- **Visual Diagrams**: `ARCHITECTURE_VISUAL.md`
- **Docker/CI-CD**: `DOCKER_CICD_SETUP.md`

---

**Last Updated**: April 20, 2026  
**Project Version**: 0.0.0  
**Maintained By**: Development Team
