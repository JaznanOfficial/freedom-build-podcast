# Features Breakdown

## 1. Authentication
- Sign up with school details
- Login with email/password
- Better-Auth integration with MongoDB adapter
- Session management

## 2. Password Recovery

### Forgot Password Flow
1. User enters email on forgot password page
2. System generates secure reset token (valid for 1 hour)
3. Sends password reset email via Resend
4. Email contains magic link with token

### Reset Password Flow
1. User clicks link in email
2. Redirected to reset password page with token
3. Validates token (check expiry)
4. User enters new password
5. Password updated, token invalidated
6. User redirected to login

### Security Measures
- Token expires after 1 hour
- One-time use tokens
- Rate limiting (max 3 requests per 15 minutes)
- Secure password hashing (bcrypt)

## 3. Dashboard
- Overview statistics (total notices, students, etc.)
- Recent notices
- Quick actions (Create Notice, Add Student)
- Subscription status

## 4. Notice Generation & Distribution

### Category Selection
Pre-defined categories:
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

### Features
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

## 5. Students Management
- Add/Edit/Delete students
- Import from CSV
- Search & filter
- Class-wise view
- View student email history

## 6. Staff Management
- Add/Edit/Delete staff members
- Import from CSV
- Search & filter by department
- Active/Inactive status
- View staff email history

## 7. Notice History
- List all notices
- Filter by category, date, audience, email status
- View, Edit, Regenerate, Delete
- Download as PDF
- Email delivery stats (sent/failed/pending)
- Resend failed emails

## 8. Subscription Management
- View current plan
- Usage statistics (notices used/limit, emails sent)
- Upgrade/Downgrade plan
- Billing history

## 9. Settings
- School profile
- User profile
- Notification preferences
- Branding (logo, colors)
