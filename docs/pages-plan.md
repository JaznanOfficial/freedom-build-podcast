# Students, Staff & Subscription Pages Plan

## 1. Students Page (`/dashboard/students`)

### Features
- **Student List Table**:
  - Columns: Roll No, Name, Class, Section, Email, Parent Email, Actions
  - Pagination
  - Sortable columns
  
- **Search & Filter**:
  - Search by name, roll number, email
  - Filter by class, section
  
- **Actions**:
  - Add Student (Dialog form)
  - Edit Student (Dialog form)
  - Delete Student (Confirmation dialog)
  - Import from CSV (File upload)
  - Export to CSV
  - View email history
  
- **Stats Cards**:
  - Total Students
  - Active Classes
  - Recent Additions

---

## 2. Staff Page (`/dashboard/staff`)

### Features
- **Staff List Table**:
  - Columns: Employee ID, Name, Department, Designation, Email, Status, Actions
  - Pagination
  - Sortable columns
  
- **Search & Filter**:
  - Search by name, employee ID, email
  - Filter by department, designation, active status
  
- **Actions**:
  - Add Staff (Dialog form)
  - Edit Staff (Dialog form)
  - Delete Staff (Confirmation dialog)
  - Toggle Active/Inactive
  - Import from CSV
  - Export to CSV
  - View email history
  
- **Stats Cards**:
  - Total Staff
  - Active Staff
  - Departments

---

## 3. Subscription Page (`/dashboard/subscription`)

### Features
- **Current Plan Section**:
  - Plan name (Basic/Pro/Enterprise)
  - Price per month
  - Renewal date
  - Status badge (Active/Cancelled)
  
- **Usage Statistics**:
  - Notices Used / Limit (Progress bar)
  - Emails Sent (This month)
  - Students Count / Limit
  - Staff Accounts / Limit
  
- **Available Plans**:
  - Show all 3 tiers (Basic, Pro, Enterprise)
  - Current plan highlighted
  - Upgrade/Downgrade buttons
  - Feature comparison
  
- **Billing History**:
  - Table with: Date, Amount, Status, Invoice
  - Download invoice button
  
- **Actions**:
  - Upgrade Plan
  - Downgrade Plan
  - Cancel Subscription
  - Update Payment Method

---

## Design Principles

1. **Consistent Layout**: All pages follow same structure with header, stats, and main content
2. **Dialogs for Forms**: Use shadcn Dialog for add/edit forms
3. **Data Tables**: Use shadcn Table with sorting and pagination
4. **Action Buttons**: Clear CTAs with icons
5. **Responsive**: Mobile-friendly layouts
6. **Empty States**: Nice empty state for no data
