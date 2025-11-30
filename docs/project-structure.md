# Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── notices/
│   │   │   ├── create/
│   │   │   └── [id]/
│   │   ├── students/
│   │   ├── staff/
│   │   ├── settings/
│   │   └── subscription/
│   ├── api/
│   │   ├── auth/[...all]/
│   │   ├── notices/
│   │   ├── email/
│   │   └── ai/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn)
│   ├── hexta/ (HextaUI components)
│   ├── auth/
│   ├── dashboard/
│   ├── notices/
│   ├── students/
│   └── staff/
├── lib/
│   ├── mongodb.ts
│   ├── auth.ts
│   ├── email.ts
│   ├── ai/
│   ├── models/
│   │   ├── user.ts
│   │   ├── school.ts
│   │   ├── student.ts
│   │   ├── staff.ts
│   │   ├── subscription.ts
│   │   ├── notice.ts
│   │   └── emailLog.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## Directory Explanations

### `/app`
Next.js 16 App Router structure with route groups

### `/components`
- `ui/` - shadcn base components
- Feature-specific folders for custom components

### `/lib`
- Database connections and models
- Authentication configuration
- Utility functions
- AI integration

### `/types`
TypeScript type definitions and interfaces
