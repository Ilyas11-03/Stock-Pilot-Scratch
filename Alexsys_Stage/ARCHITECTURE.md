# 🏗️ Technical Architecture Guide

This document provides deep technical insights into AlexSys Stage's architecture, patterns, and best practices.

---

## Table of Contents
1. [Component Architecture](#component-architecture)
2. [Data Flow & State Management](#data-flow--state-management)
3. [API Layer Design](#api-layer-design)
4. [Folder Structure Philosophy](#folder-structure-philosophy)
5. [Code Patterns & Best Practices](#code-patterns--best-practices)
6. [Extending the Application](#extending-the-application)
7. [Performance Considerations](#performance-considerations)

---

## Component Architecture

### Page Module Pattern

Each entity (Societe, Site, Zone, Allee, Rack, Range, Etage) follows a consistent pattern:

```
Pages/[EntityName]/
├── [EntityName]List.tsx      # List view with filtering/search
├── [EntityName]Table.tsx     # Data table component
├── _request.ts               # API calls & data models
└── partial/
    ├── Add[EntityName].tsx   # Creation form
    └── Edit[EntityName].tsx  # Update form
```

### Component Types

#### 1. **List Components** (`*List.tsx`)
**Purpose**: Main page container, handles layout and state management

```typescript
// Pattern
const SocietesTable: React.FC = () => {
  const [data, setData] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchData(); // Load initial data
  }, []);
  
  const handleAdd = (newItem) => {
    addItem(newItem); // Call API
    refreshData(); // Refetch
  };
  
  return (
    <div>
      <AddButton onClick={handleAddModal} />
      <SearchForm />
      <SocietesTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};
```

#### 2. **Table Components** (`*Table.tsx`)
**Purpose**: Displays data in tabular format with pagination/sorting

```typescript
// Pattern
interface Props {
  data: Societe[];
  onEdit: (item: Societe) => void;
  onDelete: (id: number) => void;
}

const SocietesTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  return (
    <table>
      {/* Table headers and body */}
      <tbody>
        {data.map(item => (
          <tr key={item.sociéteId}>
            <td onEditClick={() => onEdit(item)} />
            <td onDeleteClick={() => onDelete(item.sociéteId)} />
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

#### 3. **Form Components** (`partial/Add*.tsx`, `partial/Edit*.tsx`)
**Purpose**: User input with validation (Formik + Yup)

```typescript
// Pattern
const AddSociete: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const formik = useFormik({
    initialValues: { sociétéNom: '' },
    validationSchema: Yup.object({
      sociétéNom: Yup.string().required('Name required').min(3),
    }),
    onSubmit: async (values) => {
      try {
        await createSociete(values);
        onSuccess();
      } catch (error) {
        // Handle error
      }
    },
  });

  return <form onSubmit={formik.handleSubmit}>...</form>;
};
```

---

## Data Flow & State Management

### State Management Strategy

**Current Implementation**: React Hooks + Local Props

```
┌─────────────────────────────────────┐
│  Component State (useState)          │
│  - Local data fetching               │
│  - UI state (loading, modal open)    │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│  Context API (Auth)                  │
│  - Global auth state                 │
│  - Token management                  │
└─────────────────────────────────────┘
```

### Data Flow Example: Create Societe

```
User Input (AddSociete.tsx)
    ↓
Form Validation (Formik + Yup)
    ↓
API Call (_request.ts → createSociete())
    ↓
Axios POST to Backend
    ↓
Backend Response
    ↓
Update Parent State (SocietesTable.tsx)
    ↓
Refresh Data List
    ↓
Show Success Message (SweetAlert2)
```

### Recommended Enhancement: Redux/Zustand

For larger applications, consider:

```typescript
// Modern Redux example
const societiesSlice = createSlice({
  name: 'societies',
  initialState: { items: [], loading: false },
  reducers: {
    setSocieties: (state, action) => {
      state.items = action.payload;
    },
  },
});
```

---

## API Layer Design

### API Structure (`_request.ts` Pattern)

```typescript
import axios from 'axios';

const BASE_URL = 'https://stockpiloteapi-d8cwagb0hfhzfyau.eastus2-01.azurewebsites.net/api';
const RESOURCE_URL = `${BASE_URL}/Societe`;

// Data Models/Interfaces
export interface Societe {
  sociéteId: number;
  sociétéNom: string;
  [key: string]: any;
}

export interface CreateSocietePayload {
  sociétéNom: string;
}

// API Functions (CRUD)
export const getSocietes = async (): Promise<Societe[]> => {
  try {
    const response = await axios.get(RESOURCE_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch societies:', error);
    throw error;
  }
};

export const createSociete = async (data: CreateSocietePayload): Promise<Societe> => {
  return axios.post(RESOURCE_URL, data);
};

export const updateSociete = async (id: number, data: Partial<Societe>): Promise<Societe> => {
  return axios.put(`${RESOURCE_URL}/${id}`, data);
};

export const deleteSociete = async (id: number): Promise<void> => {
  return axios.delete(`${RESOURCE_URL}/${id}`);
};
```

### API Error Handling Best Practice

```typescript
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'API Error occurred';
  }
  return 'An unexpected error occurred';
};

// Usage
try {
  await createSociete(data);
} catch (error) {
  const message = handleApiError(error);
  Swal.fire('Error', message, 'error');
}
```

---

## Folder Structure Philosophy

### Why This Structure?

1. **Feature-Based Organization**: Each feature is self-contained and independant
   - Easy to locate code
   - Simple to add/remove features
   - Scalable architecture

2. **Separation of Concerns**:
   - Components handle UI
   - `_request.ts` handles data
   - Forms handle input validation

3. **Reusability**:
   - Partial components can be reused
   - API functions are exportable
   - Share models across components

### Scalability Path

**Current (Small)**:
```
Pages/Entity/
├── EntityList.tsx
├── EntityTable.tsx
├── _request.ts
└── partial/
```

**Next Level (Medium Scale)**:
```
features/Entity/
├── components/
│   ├── EntityList.tsx
│   ├── EntityTable.tsx
│   └── partials/
├── api/
│   ├── _request.ts
│   └── _types.ts
├── hooks/
│   └── useFetchEntity.ts
└── index.ts
```

**Enterprise Scale (Large)**:
```
src/
├── features/
├── api/
├── hooks/
├── context/
├── utils/
├── types/
└── constants/
```

---

## Code Patterns & Best Practices

### 1. Component Composition

```typescript
// ✅ Good: Functional component with clear props
interface ThemeProviderProps {
  children: React.ReactNode;
  isDark?: boolean;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, isDark = false }) => {
  return <div className={isDark ? 'dark' : 'light'}>{children}</div>;
};

// ❌ Avoid: Unclear prop types
const ThemeProvider: React.FC = (props: any) => {
  return <div>{props.children}</div>;
};
```

### 2. State Management

```typescript
// ✅ Good: Proper state types
const [societites, setSocieties] = useState<Societe[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);

// ❌ Avoid: Any types
const [data, setData] = useState(null);
const [loading, setLoading] = useState(null);
```

### 3. Error Handling

```typescript
// ✅ Good: Comprehensive error handling
try {
  const data = await getSocietes();
  setSocieties(data);
} catch (err) {
  const message = err instanceof Error ? err.message : 'Unknown error';
  setError(message);
  Swal.fire('Error', message, 'error');
}

// ❌ Avoid: Silent failures
setSocieties(await getSocietes()); // No error handling
```

### 4. Form Validation

```typescript
// ✅ Good: Type-safe Yup schema
const validationSchema = Yup.object({
  sociétéNom: Yup.string()
    .required('Name is required')
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters'),
  email: Yup.string().email('Invalid email'),
});

// ❌ Avoid: Manual validation
if (!name.trim()) error = 'Required';
if (name.length < 3) error = 'Too short';
```

---

## Extending the Application

### Adding a New Entity

#### Step 1: Create API Layer
```
src/Pages/YourEntity/_request.ts
```

```typescript
export interface YourEntity {
  id: number;
  name: string;
}

export const getYourEntities = async () => {
  return axios.get(`${BASE_URL}/YourEntity`);
};
```

#### Step 2: Create List Component
```
src/Pages/YourEntity/YourEntityList.tsx
```

```typescript
import { getYourEntities, YourEntity } from './_request';

const YourEntityList: React.FC = () => {
  const [data, setData] = useState<YourEntity[]>([]);
  
  useEffect(() => {
    getYourEntities().then(res => setData(res.data));
  }, []);
  
  return <YourEntityTable data={data} />;
};
```

#### Step 3: Create Table Component
```
src/Pages/YourEntity/YourEntityTable.tsx
```

#### Step 4: Create Form Components
```
src/Pages/YourEntity/partial/AddYourEntity.tsx
src/Pages/YourEntity/partial/EditYourEntity.tsx
```

#### Step 5: Add Route
```typescript
// App.tsx
import YourEntityList from './Pages/YourEntity/YourEntityList';

<Route path="/yourentity" element={<YourEntityList />} />
```

#### Step 6: Add Navigation
```typescript
// Sidebar.tsx
<Link to="/yourentity">Your Entity</Link>
```

---

## Performance Considerations

### 1. Component Memoization

```typescript
// ✅ Memoize expensive components
const YourEntityTable = React.memo(({ data, onEdit }: Props) => {
  return <table>...</table>;
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});
```

### 2. Data Fetching Optimization

```typescript
// ✅ Debounce search
const handleSearch = useCallback(
  debounce((query: string) => {
    searchSocieties(query);
  }, 500),
  []
);

// ❌ Avoid: Fetching on every keystroke
const handleSearch = (query: string) => {
  searchSocieties(query);
};
```

### 3. List Virtualization

```typescript
// For large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={35}
  width="100%"
>
  {Row}
</FixedSizeList>
```

### 4. Bundle Size Optimization

```typescript
// ✅ Lazy load routes
const YourEntityList = React.lazy(() => import('./Pages/YourEntity/YourEntityList'));

<Suspense fallback={<Loading />}>
  <Route path="/yourentity" element={<YourEntityList />} />
</Suspense>
```

---

## Testing Strategy

### Unit Tests Example

```typescript
// src/Pages/Societes/__tests__/SocietesTable.test.tsx
import { render, screen } from '@testing-library/react';
import SocietesTable from '../SocietesTable';

describe('SocietesTable', () => {
  it('renders society list', () => {
    const mockData = [{ sociéteId: 1, sociétéNom: 'Test Co' }];
    render(<SocietesTable data={mockData} />);
    expect(screen.getByText('Test Co')).toBeInTheDocument();
  });
});
```

### Integration Tests Example

```typescript
describe('Societes CRUD Flow', () => {
  it('creates, updates, and deletes a society', async () => {
    // Setup
    // Execute: create → update → delete
    // Assert: verify changes
  });
});
```

---

## Security Best Practices

1. **Sanitize User Input**: Always validate on frontend and backend
2. **Secure API Calls**: Use HTTPS, validate SSL certificates
3. **Token Storage**: Consider secure cookie storage vs localStorage
4. **Error Messages**: Don't expose sensitive data in error messages
5. **XSS Prevention**: React escapes by default, but sanitize custom HTML

---

## Troubleshooting Guide

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Check backend CORS configuration |
| 401 Unauthorized | Verify auth token is valid and sent |
| Stale data | Add refresh button or polling |
| Performance lag | Check Network tab, consider pagination |
| Type errors | Run `npx tsc --noEmit` for full check |

---

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev)
- [Axios Documentation](https://axios-http.com)
- [Formik Documentation](https://formik.org)
