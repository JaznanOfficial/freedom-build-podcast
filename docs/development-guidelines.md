# Development Guidelines

## STRICT RULES - MUST FOLLOW

### 1. Package Manager
- ✅ **ALWAYS use `bun`** for all package management and script execution
- ❌ **NEVER use `npm`, `yarn`, `pnpm`, or any other package manager**
- All commands must use `bun`:
  ```bash
  bun install          # NOT npm install
  bun add <package>    # NOT npm install <package>
  bun dev             # NOT npm run dev
  bun run build       # NOT npm run build
  ```

### 2. Code Organization
- ❌ **NEVER write too much code in a single file**
- ✅ **ALWAYS create small, reusable components**
- ✅ **One component = One responsibility**
- Maximum file size guideline: ~200 lines
- If a file grows larger, split into smaller components/utilities

### 3. Component Structure

```
✅ GOOD:
components/
  ├── ui/               (shadcn base components)
  ├── notices/
  │   ├── category-card.tsx
  │   ├── notice-form.tsx
  │   ├── notice-preview.tsx
  │   └── email-status.tsx
  └── students/
      ├── student-card.tsx
      ├── student-form.tsx
      └── student-table.tsx

❌ BAD:
components/
  ├── notices.tsx      (1000+ lines)
  └── students.tsx     (800+ lines)
```

### 4. Reusability First
- Extract common patterns into shared components
- Use composition over duplication
- Create utility functions for repeated logic
- Example:
  ```tsx
  // ✅ GOOD - Reusable
  <StatCard title="Students" value={1234} icon={Users} />
  <StatCard title="Staff" value={45} icon={UserCog} />
  
  // ❌ BAD - Duplicated
  <Card>...</Card>
  <Card>...</Card>
  ```

### 5. File Naming
- Use lowercase with hyphens for files: `student-card.tsx`
- Use PascalCase for components: `StudentCard`
- Use camelCase for utilities: `formatDate.ts`

### 6. Import Order
1. React/Next.js imports
2. Third-party libraries
3. Internal components
4. Types/Interfaces
5. Utilities
6. Styles
