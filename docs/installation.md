# Installation & Setup

## Prerequisites
- [Bun](https://bun.sh) (Latest version)
- MongoDB Atlas account
- Vercel account (for AI Gateway)
- Resend account (for emails)

## Step-by-Step Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd school-notice-ai
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
```
Then fill in all required variables. See [Environment Variables](./environment-variables.md) for details.

### 4. Setup MongoDB
- Create MongoDB Atlas cluster
- Get connection string
- Add to `MONGODB_URI` in `.env.local`

### 5. Setup Better-Auth
Better-Auth is configured in `src/lib/auth.ts` with MongoDB adapter.

### 6. Setup shadcn UI
```bash
bunx shadcn@latest init
bunx shadcn@latest add button input card form label select textarea
```

### 7. Run Development Server
```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Additional Setup

### Install Additional Dependencies
```bash
bun add mongodb mongoose better-auth ai @ai-sdk/gateway
bun add sonner date-fns zod react-hook-form @hookform/resolvers
bun add framer-motion resend
```

### Setup HextaUI Components
Copy components from [HextaUI](https://www.hextaui.com/) as needed.

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
bun install
```

### Database Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions
