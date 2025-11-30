# Database Schema

## Collections Overview

1. User (School Admins)
2. School
3. Student
4. Staff
5. Subscription
6. Notice
7. Category (Optional)
8. Email Log
9. Password Reset

---

## 1. User Collection (School Admins)

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

---

## 2. School Collection

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

---

## 3. Student Collection

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

---

## 4. Staff Collection

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

---

## 5. Subscription Collection

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

---

## 6. Notice Collection

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

---

## 7. Category Collection (Optional)

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

---

## 8. Email Log Collection

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

---

## 9. Password Reset Collection

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
