# Environment Variables

## Required Variables

```env
# Database
MONGODB_URI=

# Better-Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Vercel AI SDK
AI_GATEWAY_API_KEY=

# Email Service (Resend)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## How to Get API Keys

### MongoDB URI
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string from "Connect" → "Connect your application"
4. Replace `<password>` with your database password

### Better-Auth Secret
Generate a random secret:
```bash
openssl rand -base64 32
```

### AI Gateway API Key
1. Sign up at [Vercel](https://vercel.com)
2. Go to Settings → Tokens
3. Generate new token with AI Gateway access

### Resend API Key
1. Create account at [Resend](https://resend.com)
2. Go to API Keys
3. Create new API key
