# SchoolNoticeAI - Project Plan

## 🎯 Project Overview
An AI-powered platform for schools to generate professional notices and send them to students and parents instantly. Built with Next.js 16, MongoDB, Better-Auth, and Vercel AI SDK.

## 📚 Tech Stack

### Core Framework
- **Next.js 16** (App Router)
- **TypeScript**
- **React 19**

### UI & Styling
- **Tailwind CSS**
- **shadcn/ui** - Base components
- **HextaUI** (https://www.hextaui.com/) - Premium UI components
- **Lucide React** - Icons
- **Sonner** (with richColors) - Toast notifications

### Backend & Database
- **MongoDB** - Primary database
- **Mongoose** - ODM for MongoDB
- **Better-Auth** - Authentication
- **Vercel AI SDK** - AI text generation

### Deployment
- **Vercel** - Hosting & deployment

---

## � Development Guidelines

### **STRICT RULES - MUST FOLLOW**

#### 1. Package Manager
- ✅ **ALWAYS use `bun`** for all package management and script execution
- ❌ **NEVER use `npm`, `yarn`, `pnpm`, or any other package manager**
- All commands must use `bun`:
  ```bash
  bun install          # NOT npm install
  bun add <package>    # NOT npm install <package>
  bun dev             # NOT npm run dev
  bun run build       # NOT npm run build
  ```

#### 2. Code Organization
- ❌ **NEVER write too much code in a single file**
- ✅ **ALWAYS create small, reusable components**
- ✅ **One component = One responsibility**
- Maximum file size guideline: ~200 lines
- If a file grows larger, split into smaller components/utilities

#### 3. Component Structure
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

#### 4. Reusability First
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

---

## �🗄️ Database Schema

### 1. User Collection (School Admins)
```typescript
{
  _id: ObjectId,
  email: string (unique),
  name: string,
  password: string (hashed),
  schoolId: ObjectId (ref: School),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. School Collection
```typescript
{
  _id: ObjectId,
  name: string,
  address: string,
  phone: string,
  email: string,
  logo: string (url),
  subscriptionId: ObjectId (ref: Subscription),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Student Collection
```typescript
{
  _id: ObjectId,
  schoolId: ObjectId (ref: School),
  rollNumber: string,
  name: string,
  email: string,
  phone: string,
  class: string,
  section: string,
  parentName: string,
  parentEmail: string,
  parentPhone: string,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Staff Collection
```typescript
{
  _id: ObjectId,
  schoolId: ObjectId (ref: School),
  employeeId: string,
  name: string,
  email: string (unique),
  phone: string,
  department: string,
  designation: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Subscription Collection
```typescript
{
  _id: ObjectId,
  schoolId: ObjectId (ref: School),
  planTier: 'basic' | 'pro' | 'enterprise',
  status: 'active' | 'inactive' | 'cancelled',
  startDate: Date,
  endDate: Date,
  noticesLimit: number,
  noticesUsed: number,
  price: number,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Notice Collection
```typescript
{
  _id: ObjectId,
  schoolId: ObjectId (ref: School),
  userId: ObjectId (ref: User),
  category: string,
  title: string,
  content: object (form data),
  generatedContent: string (AI output),
  language: string, // any language code (en, bn, es, etc.)
  audience: 'students' | 'parents' | 'staff' | 'all',
  recipients: {
    students: ObjectId[] (ref: Student),
    parents: ObjectId[] (ref: Student),
    staff: ObjectId[] (ref: Staff)
  },
  emailStatus: 'pending' | 'sending' | 'sent' | 'failed',
  emailSentAt: Date,
  emailCount: {
    total: number,
    sent: number,
    failed: number
  },
  status: 'draft' | 'published',
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Category Collection (Optional)
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  formSchema: object (JSON schema),
  icon: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 8. Email Log Collection
```typescript
{
  _id: ObjectId,
  noticeId: ObjectId (ref: Notice),
  recipientEmail: string,
  recipientType: 'student' | 'parent' | 'staff',
  status: 'sent' | 'failed' | 'bounced',
  sentAt: Date,
  errorMessage: string,
  createdAt: Date
}
```

### 9. Password Reset Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  token: string (hashed),
  expiresAt: Date,
  isUsed: boolean,
  createdAt: Date
}
```

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
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

---

## 🎨 Features Breakdown

### 1. Authentication
- Sign up with school details
- Login with email/password
- Better-Auth integration with MongoDB adapter
- Session management

### 2. Password Recovery
- **Forgot Password Flow**:
  1. User enters email on forgot password page
  2. System generates secure reset token (valid for 1 hour)
  3. Sends password reset email via Resend
  4. Email contains magic link with token
  
- **Reset Password Flow**:
  1. User clicks link in email
  2. Redirected to reset password page with token
  3. Validates token (check expiry)
  4. User enters new password
  5. Password updated, token invalidated
  6. User redirected to login

- **Security Measures**:
  - Token expires after 1 hour
  - One-time use tokens
  - Rate limiting (max 3 requests per 15 minutes)
  - Secure password hashing (bcrypt)

### 3. Dashboard
- Overview statistics (total notices, students, etc.)
- Recent notices
- Quick actions (Create Notice, Add Student)
- Subscription status

### 3. Notice Generation & Distribution
- **Category Selection**: Pre-defined categories
  - Exam Notice
  - Holiday Notice
  - Parent Meeting
  - Fee Deadline
  - Event Announcement
  - Disciplinary Notice
  - Staff Meeting
  - Admission Notice
  - Emergency Notice
  - Custom Notice

- **Dynamic Form**: Based on selected category
- **AI Generation**: Using Vercel AI SDK
- **Language Support**: Any language (auto-detect or user selects)
- **Recipient Selection**: 
  - Students (by class/section/individual)
  - Parents (linked to students)
  - Staff (by department/individual)
  - All
- **Preview & Edit**: Before publishing
- **Auto Email Sending**: After generation/publishing
- **Download**: PDF export
- **Email Status Tracking**: Monitor delivery status

### 4. Students Management
- Add/Edit/Delete students
- Import from CSV
- Search & filter
- Class-wise view
- View student email history

### 5. Staff Management
- Add/Edit/Delete staff members
- Import from CSV
- Search & filter by department
- Active/Inactive status
- View staff email history

### 6. Notice History
- List all notices
- Filter by category, date, audience, email status
- View, Edit, Regenerate, Delete
- Download as PDF
- Email delivery stats (sent/failed/pending)
- Resend failed emails

### 7. Subscription Management
- View current plan
- Usage statistics (notices used/limit, emails sent)
- Upgrade/Downgrade plan
- Billing history

### 8. Settings
- School profile
- User profile
- Notification preferences
- Branding (logo, colors)

---

## 🎨 UI/UX Design Principles

### Design System
1. **Color Palette**
   - Primary: Indigo (#6366f1)
   - Success: Green (#10b981)
   - Error: Red (#ef4444)
   - Warning: Amber (#f59e0b)
   - Neutral: Slate

2. **Typography**
   - Font: Inter (from Google Fonts)
   - Headings: Bold, tracking tight
   - Body: Regular, leading relaxed

3. **Components**
   - Modern glassmorphism effects
   - Smooth animations (framer-motion)
   - Micro-interactions
   - Rich toast notifications (Sonner)

4. **Layout**
   - Responsive (Mobile-first)
   - Sidebar navigation
   - Clean, minimal design
   - Premium feel

---

## 🔐 Environment Variables

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

---

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
bun install
bun add mongodb mongoose better-auth ai @ai-sdk/gateway
bun add sonner date-fns zod react-hook-form @hookform/resolvers
bun add framer-motion resend
```

### 2. Setup MongoDB
- Create MongoDB Atlas cluster
- Get connection string
- Add to `.env.local`

### 3. Setup Better-Auth
- Configure with MongoDB adapter
- Create API routes

### 4. Install shadcn & HextaUI
```bash
npx shadcn@latest init
npx shadcn@latest add button input card table form
# Copy HextaUI components as needed
```

### 5. Run Development Server
```bash
bun dev
```

---

## 🚀 Development Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Project setup (Next.js 16 + TypeScript)
- [ ] MongoDB connection & models
- [ ] Better-Auth integration
- [ ] Basic UI setup (shadcn + HextaUI)

### Phase 2: Core Features (Week 2)
- [ ] Authentication pages (Login/Signup)
- [ ] Dashboard layout
- [ ] Notice category selector
- [ ] Dynamic form generator
- [ ] AI integration (Vercel AI SDK)
- [ ] Email service integration (Resend)
- [ ] Automated email sending after notice generation

### Phase 3: Advanced Features (Week 3)
- [ ] Student management
- [ ] Staff management
- [ ] Notice history & search
- [ ] Email delivery tracking & logs
- [ ] PDF generation
- [ ] Subscription management
- [ ] Settings pages

### Phase 4: Polish & Deploy (Week 4)
- [ ] UI/UX refinement
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Testing
- [ ] Deploy to Vercel

---

## 💰 Pricing Tiers

### Basic - $29/month
- 200 notices/month
- 500 students
- 3 staff accounts
- English + Bengali
- PDF download

### Pro - $49/month
- Unlimited notices
- 2000 students
- 10 staff accounts
- Custom branding
- Priority support

### Enterprise - $99/month
- Unlimited everything
- Multi-branch support
- Dedicated support
- Custom integrations
- Data export

---

## 🎯 Success Metrics
- **User Engagement**: Daily active users
- **Notice Generation**: Notices created per day
- **Conversion**: Free to paid conversion rate
- **Retention**: Monthly retention rate
- **Performance**: Page load time < 2s

---

## 📝 Notes
- Use MongoDB for better scalability
- HextaUI for premium component aesthetics
- Implement rate limiting for AI generation
- Use Resend for email delivery (100 emails/day on free tier)
- Queue email sending for large batches
- Add analytics (Vercel Analytics)
- Implement retry logic for failed emails
- Store email logs for compliance and debugging
